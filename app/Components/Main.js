import React from 'react';
import globe from '../globe'
import {
    StyleSheet,
    Image,
    Text,
    View,
    BackHandler,
    Alert,
    FlatList,
    SafeAreaView,
    TouchableHighlight,
    Modal,
    TouchableNativeFeedback,
    StatusBar,
    RefreshControl,
    ScrollView
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import AsyncStorage from '@react-native-community/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faUserFriends, faCog, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons'
import network from "../API/networking"
import PushNotification from "react-native-push-notification"
import CustomButton from "./CustomButton"
BackgroundGeolocation.configure({ startForeground: true, stopOnTerminate: false })
const style = {
    dark: StyleSheet.create({
        ViewStyle: {
            backgroundColor: '#000000',
            height: "100%"
        }
    }),
    light: StyleSheet.create({
        ViewStyle: {
            backgroundColor: '#ffffff',
            height: "100%"
        }
    }),
    layOut: StyleSheet.create({
        buText: {
            color: "#000000", marginVertical: 5,
            marginHorizontal: 0,
            fontSize: 20,
            fontWeight: "bold",
            alignSelf: "center",
            minWidth: 70
        },
        image: { width: 140, height: 80, alignSelf: "center" }
    })
}

export default class Main extends React.Component {

    state = {
        refreshing: true,
        theme: globe.theme,
        modalVisible: false,
        MainTap: false,
        loaded: false,
        SharedBuStyle: {},
        noteText: [],
        sharedNote: []
    }
    saveEdit = (change) => {
        let { login } = this.state;
        if (login != 1) {
            network(`/note?userId=${login.id}&id=${change.key}`, "PUT", change, (err) => {
                if (err) {
                    change.notEdit = true
                }
                this.setState(({ noteText, flatList }) => {
                    noteText[change.key - 1] = change;
                    return { noteText, flatList: !flatList }
                }, this.saveNote)
            })
        } else {
            this.setState(({ noteText, flatList }) => {
                noteText[change.key - 1] = change;
                return { noteText, flatList: !flatList }
            }, this.saveNote)
        }



    }
    renderItem = ({ item, index }) => {
        let showShareInfo = (item) => {
            if (item.shareUser && item.shareUser.length && this.state.login) {
                return (<FontAwesomeIcon icon={faUserFriends} color={'#555555'} size={30} />)
            } else if (item.SharedBy) {
                return (<Text style={{ fontSize: 20, color: "#555555" }}>Shared by {item.SharedBy}</Text>)
            }
        }
        let ShareInfo = showShareInfo(item)

        return (
            <TouchableHighlight style={{ margin: 10 }}
                onLongPress={() => this.props.navigation.navigate("editedNote", {
                    item, saveChange: this.saveEdit,
                    deleteNote: () => {
                        let { noteText, login } = this.state;
                        let deleteIt = ()=>{
                            noteText.splice(index, 1);
                            for (let i = index; noteText.length > i;) {
                                noteText[i].key = ++i
                            };
                            this.setState(({ flatList }) => ({ noteText, flatList: !flatList }), this.saveNote)
                        }
                        if (login != 1) {
                            network(`/note?userId=${login.id}&id=${index + 1}`, "DELETE", item.shareUser, (err) => { 
                                if(err){
                                    Alert.alert("Error","Note cannot be delete due to connection error")
                                }else{
                                    deleteIt()
                                }
                            })
                        }else{
                            deleteIt()
                        }
                       
                    }
                })}
                disabled={item.SharedBy}>
                <View style={{ borderColor: "#555555", borderWidth: 1, backgroundColor: item.backgroundColor, minHeight: 150 }}>
                    <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 30, color: "#555555" }}>Note {item.key.toString()}:{item.title}</Text>
                        {ShareInfo}
                    </View>
                    <Text style={{ fontSize: item.fontSize, fontFamily: item.fontFamily, color: item.fontColor }}>{item.note}</Text>
                </View>
            </TouchableHighlight>
        )
    }
    componentDidMount() {
       
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this._closeApp)
        AsyncStorage.multiGet(["MainTap", "logIn", "setting", "note"], (err, [MainTap, logIn, setting, noteText]) => {
            MainTap = MainTap[1];
            setting = setting[1];
            let login = logIn[1]
            let sharedNote = [];
            let theme = "light"
            try {
                if (!Array.isArray(noteText) || !noteText.length || noteText[1] === null) {
                    noteText = []
                } else {
                        noteText = JSON.parse(noteText[1])          
                }
            }
            catch (e) {
                noteText = []
            }
            try {
                setting = JSON.parse(setting)
                setTimeout(() => {
                    this.setNotification(setting.location && setting.notification)
                }, 1000);
                theme = setting.theme
            } catch (e) { }
            if (login != 1) {
                login = JSON.parse(login)
                noteText.forEach(x => {
                    if (x.notSave) {
                        x.notSave = false
                        delete x.notSave
                        network(`/note?userId=${login.id}`, "POST", x, (err) => { if (err) { x.notSave = true } })
                    }else if(x.notEdit){
                        delete x.notEdit
                        network(`/note?userId=${login.id}&id=${x.key}`, "PUT", x, (err) => {if (err) { x.notEdit = true }})
                    }
                })
                setTimeout(() => {
                    this.change(MainTap == "true")
                    this.setState({ theme, login });
                    network(`/note?userId=${login.id}`, "GET", [], (err, data) => {
                        if (!err) {
                            noteText = data
                        }
                        network(`/sharedNote?userId=${login.id}`, "GET", [], (err, data) => {
                            if (!err) {
                                sharedNote = data
                            }
                            noteText.forEach(x=>{delete x.notSave})
                            this.setState({ login, noteText, sharedNote, refreshing: false },()=>this.saveNote());
                        })
                    })
                }, 10);
            } else {
                this.note = () => {
                    if (this.state.noteText.length) { return <FlatList keyExtractor={(item, index) => `list-item-${index}`} extraData={this.state.flatList} data={this.state.noteText} renderItem={this.renderItem} /> }
                    else { return <Text style={{ fontSize: 30, marginTop: 100, marginTop: 100, alignSelf: "center", color: this.state.theme === "dark" ? "white" : "black" }}>No note to show</Text> }
                }
                this.setState({
                    PersonalBu: "#ffffff"
                    , SharedBu: "#ff0000"
                    , loaded: true
                    , theme
                    , login
                    , noteText
                })

            }

        })
    }
    componentWillUnmount() {
        this.backHandler.remove()
        AsyncStorage.setItem("MainTap", this.state.MainTap.toString())
    }
    saveNote = () => {AsyncStorage.setItem("note", JSON.stringify(this.state.noteText));}
    _closeApp = () => {
        Alert.alert(
            "Exit App",
            "Do you want to exit?",
            [
                {
                    text: "No",
                    style: "cancel"
                },
                { text: "Yes", onPress: () => { this.saveNote(); BackHandler.exitApp() } }
            ],
            { cancelable: true }
        );
        return true
    }
    setNotification = (on) => {
        if (on) {
            BackgroundGeolocation.on("location", (location) => {
                BackgroundGeolocation.startTask(taskKey => {
                    let maxLat = location.latitude + 0.0001;
                    let minLat = location.latitude - 0.0001;
                    let maxLon = location.longitude + 0.0001;
                    let minLon = location.longitude - 0.0001;
                    this.state.noteText.forEach(element => {
                        try {
                            if (element.location) {
                                let { latitude, longitude } = element.location
                                if ((latitude <= maxLat && latitude >= minLat) && (longitude <= maxLon && longitude >= minLon)) {
                                    PushNotification.localNotification({ title: element.title, message: element.note })
                                }
                            }
                        } catch (e) { }
                    });
                    BackgroundGeolocation.endTask(taskKey)
                })

            })
            BackgroundGeolocation.on("error", (e) => { })
            BackgroundGeolocation.start()
        } else {
            BackgroundGeolocation.stop();
        }
    }
    change = (input) => {
        if (this.state.login != 1) {
            if (input) {

                this.note = () => {
                    let refreshControl = (<RefreshControl refreshing={this.state.refreshing} onRefresh={() => {
                        this.setState({ refreshing: true })
                        network(`/sharedNote?userId=${this.state.login.id}`, "GET", [], (err, data) => {
                            if (!err) {
                                this.setState({ sharedNote: data, refreshing: false });
                            } else { this.setState({ refreshing: false }) }
                        })
                    }} />)
                    if (this.state.sharedNote.length) { return <FlatList keyExtractor={(item, index) => `list-item-${index}`} refreshControl={refreshControl} data={this.state.sharedNote} renderItem={this.renderItem} /> }
                    else { return <ScrollView refreshControl={refreshControl}><Text style={{ fontSize: 30, marginTop: 100, alignSelf: "center", color: this.state.theme === "dark" ? "white" : "black" }}>No note to show</Text></ScrollView> }
                }
                this.setState({
                    MainTap: true
                    , PersonalBu: "#ffffff"
                    , SharedBu: "#009900"
                    , loaded: true
                })

            } else {
                this.note = () => {
                    let refreshControl = (<RefreshControl refreshing={this.state.refreshing} onRefresh={() => {
                        this.state.noteText.forEach(x => {
                            if (x.notSave) {
                                delete x.notSave
                                network(`/note?userId=${this.state.login.id}`, "POST", x, (err) => { if (err) { x.notSave = true } })
                            }else if(x.notEdit){
                                delete x.notEdit
                                network(`/note?userId=${login.id}&id=${x.key}`, "PUT", x, (err) => {if(err){x.notEdit =true}})
                            }
                        })
                        this.setState({ refreshing: true })
                        network(`/note?userId=${this.state.login.id}`, "GET", [], (err, data) => {
                            if (!err) {
                                this.setState({ noteText: data, refreshing: false });
                            } else { this.setState({ refreshing: false }) }
                        })
                    }} />)
                    if (this.state.noteText.length) { return <FlatList keyExtractor={(item, index) => `list-item-${index}`} refreshControl={refreshControl} extraData={this.state.flatList} data={this.state.noteText} renderItem={this.renderItem} /> }
                    else { return <ScrollView refreshControl={refreshControl}><Text style={{ fontSize: 30, marginTop: 100, alignSelf: "center", color: this.state.theme === "dark" ? "white" : "black" }}>No note to show</Text></ScrollView> }
                }
                this.setState({
                    MainTap: false
                    , PersonalBu: "#009900"
                    , SharedBu: "#ffffff"
                    , loaded: true
                })

            }
        } else { this.setState({ modalVisible: true }) }

    }
    render() {
        const { navigate, reset } = this.props.navigation;
        let image, iconColour;
        if (this.state.theme == "light") {
            image = require("../Images/lightLogo.png");
            iconColour = "#000000"
        } else {
            image = require("../Images/darkLogo.png");
            iconColour = "#ffffff";
        }

        if (this.state.loaded) {
            return (
                <View style={style[this.state.theme].ViewStyle}>
                    <StatusBar backgroundColor={this.state.theme === "dark" ? "black" : "white"} barStyle={this.state.theme === "dark" ? "light-content" : "dark-content"} />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TouchableNativeFeedback onPress={() => navigate("setting", { setSetting: ({ theme, location, notification }) => { this.setState({ theme }); this.setNotification(location && notification) } })}>
                            <FontAwesomeIcon icon={faCog} color={iconColour} size={50} style={{ marginTop: 10 }} />
                        </TouchableNativeFeedback>
                        <Image style={style.layOut.image} source={image} />
                        <View />
                    </View>
                    <View style={{ flexDirection: "row", alignSelf: "center", width: "80%", justifyContent: 'space-between', }}>
                        <CustomButton colour="#000000" onPress={() => this.change(false)} underlayColour="green" backgroundColour={this.state.PersonalBu} disabled={this.state.login == 1}>Personal </CustomButton>
                        <CustomButton colour={this.state.login == 1 ? "#ffffff" : "#000000"} onPress={() => this.change(true)} underlayColour="green" backgroundColour={this.state.SharedBu} >Shared</CustomButton>
                    </View>
                    <SafeAreaView style={{ height: 100 }} style={{ flex: 1 }}>{this.note()}</SafeAreaView>
                    <TouchableHighlight style={{ position: "absolute", bottom: 20, right: 20 }}
                        onPress={() => navigate('newNote', {
                            saveNote: (note) => {
                                this.setState(({ noteText, login }) => {
                                    if (login != 1) {
                                        network(`/note?userId=${login.id}`, "POST", note, (err) => {
                                            if (err) {
                                                note.notSave = true
                                            }
                                            this.setState({ noteText: noteText.concat(note) }, this.saveNote)
                                        })
                                    } else { return { noteText: noteText.concat(note) } }
                                }, this.saveNote)
                            },
                            key: this.state.noteText.length + 1
                        })}
                    >
                        <FontAwesomeIcon icon={faPlusCircle} color={iconColour} size={35} />
                    </TouchableHighlight>
                    <Modal
                        animationType="fade"
                        transparent={true}

                        visible={this.state.modalVisible}
                        onRequestClose={() => this.setState({ modalVisible: false })}
                        hardwareAccelerated={true}>
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: "#00000055" }}>
                            <View style={[style[this.state.theme].ViewStyle, {
                                alignItems: 'center',
                                height: 200,
                                width: '90%',
                                borderWidth: 1,
                                borderColor: '#555555',
                                borderRadius: 7,
                            }]}>
                                <TouchableHighlight onPress={() => this.setState({ modalVisible: false })} style={{ alignSelf: "flex-end", margin: 5 }}><FontAwesomeIcon size={30} color={iconColour} icon={faTimesCircle} /></TouchableHighlight>
                                <Text style={{ alignSelf: "center", color: iconColour, fontSize: 30, fontWeight: "bold" }}>Restricted Feature</Text>
                                <Text style={{ color: iconColour, margin: 10, fontFamily: "Roboto", fontSize: 16 }}>Login or Create an Account to get access to the [Shared] Feature</Text>
                                <View style={{ flexDirection: "row", width: "80%", justifyContent: 'space-between', alignSelf: "center" }}>
                                    <CustomButton onPress={() => { this.setState({ modalVisible: false }); AsyncStorage.removeItem("logIn", () => reset([NavigationActions.navigate({ routeName: "login" })])) }} underlayColour="green" backgroundColour="#aaffaa" >Login</CustomButton>
                                    <CustomButton onPress={() => { this.setState({ modalVisible: false }); AsyncStorage.removeItem("logIn", () => reset([NavigationActions.navigate({ routeName: "login" }), NavigationActions.navigate({ routeName: "signUp" })])) }} underlayColour="green" backgroundColour="#aaffaa" >Sign Up</CustomButton>
                                </View>

                            </View>
                        </View>
                    </Modal>
                </View>
            )
        } else { return <View style={style[this.state.theme].ViewStyle} /> }
    }
}
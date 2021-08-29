import React from 'react';
import globe from '../globe'
import {
    StyleSheet,
    Button,
    Text,
    View,
    TextInput,
    BackHandler,
    TouchableHighlight,
    Modal,
    FlatList,
    Alert
} from 'react-native';
import NoteEditor from "./NoteEditor"
import CustomButton from "./CustomButton"
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import network from "../API/networking"
import AsyncStorage from '@react-native-community/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons'
import { faChevronCircleLeft, faShareAlt } from '@fortawesome/free-solid-svg-icons'
const style = {
    dark: StyleSheet.create({
        ViewStyle: {
            backgroundColor: '#000000',
            height: "100%"
        },
        text: { color: "#ffffff", borderBottomColor: "#ffffff" }
    }),
    light: StyleSheet.create({
        ViewStyle: {
            backgroundColor: '#ffffff',
            height: "100%"
        },
        text: { color: "#000000", borderBottomColor: "#000000" }
    }),
    layOut: StyleSheet.create({
        textInput: {
            alignSelf: "center"
            , width: "80%"
            , borderBottomWidth: 0.5
        },
        text: {
            color: "#808080",
            alignSelf: "center",
            fontSize: 20,
            fontFamily: "Roboto",
            marginTop: 10
        }, fontBu: { fontWeight: "bold", fontSize: 20, paddingRight: 5, height: 25, paddingLeft: 5, }
    })
}

export default class NewNote extends React.Component {
    state = {
        note: "",
        title: "",
        theme: globe.theme,
        modalVisible: false,
        shareUser: [],
        colorPicker: ""
    }
    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.props.navigation.goBack())
        AsyncStorage.multiGet(["setting", "logIn"], (error, [setting, logIn]) => {
            let login = logIn[1] == 1 ? false : true;
            try {
                let { location } = JSON.parse(setting[1])
                this.setState({ login, location })
            } catch (e) {
                this.setState({ login })
            }
        })

    }
    componentWillUnmount() {
        this.backHandler.remove()
    }
    saveNote = () => {
        let { shareUser } = this.state;
        let { fontColor, fontFamily, note, backgroundColor, fontSize, title } = this.getData()
        let { key } = this.props.navigation.state.params;
        note = note || " "
        title = title || " "
        shareUser = shareUser || [];
        let location = null
        let goBackTo = () => {
            this.props.navigation.state.params.saveNote({ location, shareUser, fontColor, fontFamily, note, backgroundColor, fontSize, title, key })
            this.props.navigation.goBack();
        }
        if (this.state.location) {
            BackgroundGeolocation.getCurrentLocation((pos) => {
                let { latitude, longitude } = pos
                location = { latitude, longitude }
                goBackTo()
            }, (err) => Alert.alert("Error", "Unable to find location\ndo you want go on without saving location?",
                [{ text: "No", style: "cancel" }, {
                    text: "Yes", onPress: goBackTo
                }]), { enableHighAccuracy: true })
        } else { goBackTo() }
    }
    addUser = () => {
        if (this.state.tempTxt) {
            network(`/users?username=${this.state.tempTxt.toUpperCase()}`, "GET", [], (err, data, status) => {
                if (err != null) { Alert.alert("Error", err.bodyString ? err.bodyString : "unknow error") }
                else {
                    if (status === 204) {
                        this.setState(({ tempShareUser, tempTxt }) =>( { tempShareUser: tempShareUser.concat({ key: tempTxt }), tempTxt: null }))
                    }
                }

            })

        }
    }

    render() {
        let iconColour = this.state.theme == "light" ? "#000000" : "#ffffff";
        let shareButton = this.state.login ? (<TouchableHighlight onPress={() => { let tempShareUser = []; this.state.shareUser.forEach((key, y) => { tempShareUser[y] = { key } }); this.setState({ modalVisible: true, tempShareUser }) }}>
            <FontAwesomeIcon icon={faShareAlt} color={iconColour} size={50} style={{ marginTop: 10 }} />
        </TouchableHighlight>) : <View />;
        return (
            <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 10, backgroundColor: this.state.theme == "dark" ? "#000000" : "#ffffff" }}>
                    <TouchableHighlight onPress={() => this.props.navigation.goBack()}>
                        <FontAwesomeIcon icon={faChevronCircleLeft} color={iconColour} size={50} style={{ marginTop: 10 }} />
                    </TouchableHighlight>
                    <Text style={{ color: iconColour, fontSize: 30, marginTop: 15, fontWeight: "bold", fontFamily: "Roboto" }}>New Note</Text>
                    {shareButton}
                </View>
                <NoteEditor getData={(data) => this.getData = data} item={{
                    note: "",
                    title: "",
                    fontSize: 16,
                    bold: false,
                    italic: false,
                    underline: false,
                    fontColor: "black",
                    backgroundColor: "#13CE66"
                }} />
                <View style={{ position: "absolute", right: 10, bottom: 150, zIndex: 10 }}><CustomButton backgroundColour="#8B9BF3" colour="#202020" underlayColour="#8B9BE0" onPress={this.saveNote}>Save</CustomButton></View>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => this.setState({ modalVisible: false })}>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: "#00000055" }}>
                        <View style={[style[this.state.theme].ViewStyle, {
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: 200,
                            width: '90%',
                            borderWidth: 1,
                            borderColor: '#808080',
                            borderRadius: 7,
                        }]}>
                            <Text style={style.layOut.text}>Invite Others To View This Note</Text>
                            <View style={{ flexDirection: "row", width: "80%", justifyContent: 'space-between', alignSelf: "center" }}>
                                <TextInput style={{ color: iconColour, borderBottomColor: iconColour, borderBottomWidth: 0.5 }} placeholder="Enter email or username" placeholderTextColor="#808080" value={this.state.tempTxt} onChangeText={(tempTxt) => this.setState({ tempTxt })} style={[style[this.state.theme].text, style.layOut.textInput]} onSubmitEditing={this.addUser} />
                                <View style={{ marginTop: 5 }}><Button title="add" color="#808080" onPress={this.addUser} /></View>
                            </View>
                            <Text style={{ color: "#808080", fontSize: 15, fontFamily: "Roboto", marginTop: 5, marginLeft: 40, alignSelf: "flex-start" }}>Shared with:</Text>
                            <FlatList extraData={this.state.refresh} data={this.state.tempShareUser}
                                renderItem={(item) => <View style={{ flexDirection: "row", justifyContent: "space-between", width: "50%", alignSelf: 'center' }}><Text style={{ color: iconColour }}>{item.item.key}</Text><TouchableHighlight onPress={() => { let { tempShareUser } = this.state; tempShareUser.splice(item.index, 1); this.setState({ tempShareUser }) }} ><FontAwesomeIcon icon={faTimesCircle} color={iconColour} /></TouchableHighlight></View>} />
                            <View style={{ flexDirection: "row", width: "80%", justifyContent: 'space-between', alignSelf: "center", marginTop: 10, marginBottom: 5 }}>
                                <Button title="Cancel" color="#808080" onPress={() => this.setState({ tempTxt: null, modalVisible: false, tempShareUser: null })} />
                                <Button title="share" color="#808080" onPress={() => { let shareUser = []; this.state.tempShareUser.forEach((x, y) => { shareUser[y] = x.key }); this.setState({ tempTxt: null, modalVisible: false, shareUser }) }} />
                            </View>

                        </View>
                    </View>
                </Modal>
            </View>

        )
    }

}
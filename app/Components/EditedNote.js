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
import network from "../API/networking"
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faChevronCircleLeft, faShareAlt } from '@fortawesome/free-solid-svg-icons'
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons'
import CustomButton from "./CustomButton"
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
export default class EditeNote extends React.Component {
    saveNote = () => {
        let { key, shareUser, location } = this.state;
        let { fontColor, fontFamily, note, backgroundColor, fontSize, title} =this.getData()
        note = note || " "
        title = title || " "
        shareUser = shareUser || [];
        this.props.navigation.state.params.saveChange({ location, shareUser, fontColor, fontFamily, note, backgroundColor, fontSize, title, key })
        this.props.navigation.goBack();
    }
    deleteNote = () => {
        this.props.navigation.state.params.deleteNote();
        this.props.navigation.goBack();
    }
    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.props.navigation.goBack())
        this.setState({ ...this.props.navigation.state.params.item })

    }
    addUser = () => {
        if (this.state.tempTxt) {
            network(`/users?username=${this.state.tempTxt.toUpperCase()}`, "GET", [], (err, data, status) => {
                if (err != null) { Alert.alert("Error", err.bodyString ? err.bodyString : "unknown error") }
                else {
                    if (status === 204) {
                        this.setState(({ tempShareUser, tempTxt }) => {
                            return { tempShareUser: tempShareUser.concat({ key: tempTxt }), tempTxt: null }
                        })
                    }
                }

            })
        }
    }
    componentWillUnmount() {
        this.backHandler.remove()
    }
    state = {login:globe.login == 1 ? false : true,colorPicker:"", theme: globe.theme, fontSize: 16, bold: false, italic: false, underline: false, fontColor: "black", backgroundColor: "green", modalVisible: false, shareUser: [] }
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
                    <Text style={{ color: iconColour, fontSize: 30, marginTop: 15, fontWeight: "bold", fontFamily: "Roboto" }}>Edit Note</Text>
                    {shareButton}
                </View>
                <NoteEditor item={{...this.props.navigation.state.params.item}} getData={(data)=>this.getData=data}/>
                <View style={{ position: "absolute", alignSelf: "center", justifyContent: "space-between", minWidth: "70%", bottom: 200, flexDirection: "row" }}>
                    <View><CustomButton backgroundColour="#ff1111" colour="#202020" underlayColour="#ff0000" onPress={() => Alert.alert("Delete note", "Are you sure you want to delete note", [{ text: "No", style: "cancel" }, { text: "Yes", onPress: this.deleteNote }])}>Delete</CustomButton></View>
                    <View><CustomButton colour="#202020" backgroundColour="#8B9BF3" underlayColour="#8B9BF3" onPress={this.saveNote}>Save</CustomButton></View>
                </View>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => this.setState({ modalVisible: false })}>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' ,backgroundColor:"#00000055"}}>
                        <View style={[style[this.state.theme].ViewStyle, {
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: 200,
                            width: '90%',
                            borderWidth: 1,
                            borderColor: '#555555',
                            borderRadius: 7,
                        }]}>
                            <Text style={style.layOut.text}>Invite Others To View This Note</Text>
                            <View style={{ flexDirection: "row", width: "80%", justifyContent: 'space-between', alignSelf: "center" }}>
                                <TextInput style={{ color: iconColour, borderBottomColor: iconColour, borderBottomWidth: 0.5 }} placeholder="Enter email or username" placeholderTextColor="#808080" value={this.state.tempTxt} onChangeText={(tempTxt) => this.setState({ tempTxt })} style={[style[this.state.theme].text, style.layOut.textInput]} onSubmitEditing={this.addUser} />
                                <View style={{ marginTop: 5 }} ><Button title="add" color="#808080" onPress={this.addUser} /></View>
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
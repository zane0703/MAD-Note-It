import React from 'react';
import globe from '../globe'
import {
    StyleSheet,
    Text,
    View,
    BackHandler,
    Switch,
    TextInput,
    Button,
    ScrollView,
    Alert,
    StatusBar
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faAdjust, faMapMarkerAlt, faBell } from '@fortawesome/free-solid-svg-icons'
import AsyncStorage from '@react-native-community/async-storage';
import network from "../API/networking"
const style = {
    dark: StyleSheet.create({
        ViewStyle: {
            backgroundColor: '#000000',
            height: "100%"
        },
        text: { color: "#ffffff", borderBottomColor: "#ffffff", marginTop: 1 }
    }),
    light: StyleSheet.create({
        ViewStyle: {
            backgroundColor: '#ffffff',
            height: "100%"
        },
        text: { color: "#000000", borderBottomColor: "#000000", marginTop: 1 }
    }),
    layOut: StyleSheet.create({
        toggleList: {
            alignSelf: "flex-end",
            flexDirection: "row",
            alignItems: 'center',
            margin: 7
        },
        toggleText: {
            color: "#808080",
            fontSize: 30,
            marginRight: 5,
            marginLeft: 5
        },
        PasswordInput: {
            alignSelf: "center",
            width: "90%",
            borderBottomWidth: 0.5
        }
    })
}

export default class Setting extends React.Component {
    state = {
        pass: "",
        theme: globe.theme,
        notification: false,
        location: false,
        loaded: false
    }
    componentDidMount() {
        let backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.props.navigation.goBack())
        this.componentWillUnmount = backHandler.remove
        AsyncStorage.multiGet(["setting", "logIn"], (error, [setting, logIn]) => {
            logIn = logIn[1]
            try {
                logIn = JSON.parse(logIn)
            } catch (e) { }
            try {
                setting = JSON.parse(setting[1])
                this.setState({ ...setting, logIn, loaded: true, })
            } catch (e) {
                this.setState({ loaded: true, })
            }

        })

    }
    saveSetting = () => {
        let { theme, notification, location } = this.state;
        let setting = { theme, notification, location }
        globe.theme = theme
        if (this.state.logIn != 1) {
            let { pass, conPass, cPass } = this.state;
            if (pass.trim() !== "") {
                if (pass === conPass) {
                    let body = { pass, cPass }
                    network(`/password?userId=${this.state.logIn.id}`, "PUT", body, (err, body, status) => {
                        if (err != null) { Alert.alert("Error", err.bodyString ? err.bodyString : "fail to change password due to unknown error") }
                        else if (status === 204) {
                            Alert.alert("Massage", "password has been successfully changed")
                            this.props.navigation.state.params.setSetting(setting)
                            AsyncStorage.setItem("setting", JSON.stringify(setting),this.goBack)
                        }
                    })
                } else { Alert.alert("Error", "New password and Confirm Password must be the same ") }
            } else {
                this.props.navigation.state.params.setSetting(setting)
                AsyncStorage.setItem("setting", JSON.stringify(setting), this.goBack)
            }
        } else {
            this.props.navigation.state.params.setSetting(setting)
            AsyncStorage.setItem("setting", JSON.stringify(setting), this.goBack)
        }
    }
    goBack = this.props.navigation.goBack.bind(this);
    render() {
        const { reset, goBack } = this.props.navigation;
        let iconColour
        if (this.state.theme == "light") {
            iconColour = "#000000"
        } else {
            iconColour = "#ffffff"
        }
        if (this.state.loaded) {
            let resetPW = this.state.logIn != 1 ? [<Text style={{ fontSize: 40, alignSelf: "center", color: "#505050" }}>Reset password</Text>
                , <TextInput returnKeyType="next" autoCompleteType="password" onChangeText={cPass => this.setState({ cPass })} value={this.state.cPass} placeholderTextColor="#505050" style={[style[this.state.theme].text, style.layOut.PasswordInput]} secureTextEntry={true} placeholder="Current Password" onSubmitEditing={() => this.secondTextInput.focus()} />
                , <TextInput returnKeyType="next" autoCompleteType="password" onChangeText={pass => this.setState({ pass })} value={this.state.pass} placeholderTextColor="#505050" style={[style[this.state.theme].text, style.layOut.PasswordInput]} secureTextEntry={true} placeholder="New Password" ref={input => this.secondTextInput = input} onSubmitEditing={() => this.thirdTextInput.focus()} />
                , <TextInput returnKeyType="done" autoCompleteType="password" onChangeText={conPass => this.setState({ conPass })} value={this.state.conPass} placeholderTextColor="#505050" style={[style[this.state.theme].text, style.layOut.PasswordInput]} secureTextEntry={true} placeholder="Confirm Password" ref={input => this.thirdTextInput = input} />] : null;
            return (
                <ScrollView style={style[this.state.theme].ViewStyle}>
                    <StatusBar backgroundColor={this.state.theme==="dark"?"black":"white"} barStyle={this.state.theme==="dark"?"light-content":"dark-content"} />
                    <Text style={{ fontSize: 50, alignSelf: "center", color: "#808080" }}>Settings</Text>
                    <View style={{ alignSelf: "center" }}>
                        <View style={style.layOut.toggleList}>
                            <FontAwesomeIcon color={iconColour} icon={faAdjust} />
                            <Text style={style.layOut.toggleText}>Dark Theme</Text>
                            <Switch trackColor={{ false: "#505050" }} onValueChange={value =>  this.setState({ theme:value ? "dark" : "light" }) } value={this.state.theme === "dark"} />
                        </View>
                        <View style={style.layOut.toggleList}>
                            <FontAwesomeIcon on color={iconColour} icon={faBell} />
                            <Text style={style.layOut.toggleText}>Notification</Text>
                            <Switch trackColor={{ false: "#505050" }} onValueChange={notification => this.setState({ notification })} value={this.state.notification} />
                        </View>
                        <View style={style.layOut.toggleList}>
                            <FontAwesomeIcon color={iconColour} icon={faMapMarkerAlt} />
                            <Text style={style.layOut.toggleText}>Location</Text>
                            <Switch trackColor={{ false: "#505050" }} onValueChange={location => this.setState({ location })} value={this.state.location} />
                        </View>

                    </View>
                    {resetPW}
                    <View style={{ alignSelf: "center", justifyContent: "space-between", width: "70%", flexDirection: "row", marginTop: 20 }}>
                        <Button onPress={() => goBack()} title="Cancel" color="#505050" />
                        <Button title="Save" color="#505050" onPress={this.saveSetting} />
                    </View>
                    <View style={{ alignSelf: "center", flexDirection: "row", marginTop: 20 }}>
                        <Button onPress={() => {
                            let resetLog = () => AsyncStorage.removeItem("logIn", () => reset([NavigationActions.navigate({ routeName: "login" })]));
                            if (this.state.logIn != 1) { AsyncStorage.removeItem("note", (err) => { network(`/logOut?id=${this.state.logIn.id}`, "DELETE", [], resetLog) }) }
                            else { resetLog() }
                        }} title="Log Out" color="#505050" />
                    </View>
                </ScrollView>
            )
        } else { return null }

    }
}
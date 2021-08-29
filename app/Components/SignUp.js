import React from 'react';
import globe from '../globe'
import {
    StyleSheet,
    Image,
    Button,
    Text,
    View,
    TextInput,
    Modal,
    ScrollView,
    BackHandler,
    Alert,
    Switch,
    Platform,
    KeyboardAvoidingView
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import network from "../API/networking"
const CheckBox2 = Platform.select({
    android: CheckBox,
    ios: Switch
})
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
            color: "#555555",
            alignSelf: "center",
            fontSize: 30,
            fontFamily: "Roboto",
            marginTop: 10,
            fontWeight: "bold"
        }
    })
}

export default class SignUp extends React.Component {
    state = {
        modalVisible: false,
        theme: globe.theme,
    }
    componentDidMount() {
        let backHandler = BackHandler.addEventListener('hardwareBackPress', this.props.navigation.goBack)
        this.componentWillUnmount = backHandler.remove
        this.setState(({ theme }) => ({ image: theme == "dark" ? require("../Images/darkLogo.png") : require("../Images/lightLogo.png") }))
    }
    isValidEmail(inputValue) {
        let atPos = inputValue.indexOf("@");
        let dotPos = inputValue.lastIndexOf(".");
        let isValid = (atPos > 0) && (dotPos > atPos + 1) && (inputValue.length > dotPos + 2);
        return isValid
    }
    submitted = () => {
        let { userName, Password, CPassword, email, tAndC } = this.state;
        if (userName && Password && CPassword && email) {
            if (Password === CPassword) {
                if (this.isValidEmail(email)) {
                    if (tAndC) {
                        this.setState({ modalVisible: true })
                    } else {
                        Alert.alert("Error", "Please accept the terms and conditions")
                    }
                } else {
                    Alert.alert("Error", "Invalid Email")
                }

            } else {
                Alert.alert("Error", "Your password not match")
            }
        } else { Alert.alert("Error", "Please fill in all the required fields") }
    }
    SignUp = () => {
        this.setState({ modalVisible: false })
        let body = { username: this.state.userName.toUpperCase(), email: this.state.email, password: this.state.CPassword }
        network("/signUp", "POST", body, (error, data, status, cookie) => {
            console.log(error)
            if (error !== null) { Alert.alert("Error", error.bodyString ? error.bodyString : "unknown error") }
            else {
                Alert.alert("Sign Up", "You have successfully created an account")
                this.props.navigation.goBack()
            }
        })

    }
    checkBoxChange = () => this.setState(({ tAndC }) => ({ tAndC: !tAndC }));
    render() {
        const { goBack } = this.props.navigation;
        let image = this.state.theme == "light" ? require("../Images/lightLogo.png") : require("../Images/darkLogo.png");
        return (
            <ScrollView style={style[this.state.theme].ViewStyle}>
                <Image style={style.layOut.image} source={image} style={{ width: "100%" }} resizeMode="contain" />
                <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={5}>
                    <TextInput returnKeyType="next" autoCompleteType="username" onChangeText={(userName => { this.setState({ userName }) })} placeholderTextColor="#808080" placeholder="Username" style={[style[this.state.theme].text, style.layOut.textInput]} onSubmitEditing={() => this.secondTextInput.focus()} />
                    <TextInput returnKeyType="next" autoCompleteType="password" onChangeText={(Password => { this.setState({ Password }) })} placeholderTextColor="#808080" secureTextEntry={true} placeholder="Password" style={[style[this.state.theme].text, style.layOut.textInput]} ref={(input) => this.secondTextInput = input} onSubmitEditing={() => this.thirdTextInput.focus()} />
                    <TextInput returnKeyType="next" autoCompleteType="password" onChangeText={(CPassword => { this.setState({ CPassword }) })} placeholderTextColor="#808080" secureTextEntry={true} placeholder="Confirm Password" style={[style[this.state.theme].text, style.layOut.textInput]} ref={(input) => this.thirdTextInput = input} onSubmitEditing={() => this.fourthTextInput.focus()} />
                    <TextInput returnKeyType="done" autoCompleteType="email" keyboardType="email-address" onChangeText={(email => { this.setState({ email }) })} placeholderTextColor="#808080" placeholder="Email" style={[style[this.state.theme].text, style.layOut.textInput]} ref={(input) => this.fourthTextInput = input} />
                </KeyboardAvoidingView>
                <View style={{ flexDirection: "row", alignSelf: "center", marginTop: 20 }}>
                    <CheckBox2 tintColors={{ false: "505050" }} value={this.state.tAndC} onChange={this.checkBoxChange} />
                    <Text style={[style[this.state.theme].text, { marginTop: 5, textDecorationLine: "underline" }]}>I agree to the terms and conditions</Text>
                </View>
                <View style={{ flexDirection: "row", width: "80%", justifyContent: 'space-between', alignSelf: "center" }}>
                    <Button title="Cancel" color="#555555" onPress={() => goBack()} />
                    <Button title="Sign Up" color="#555555" onPress={this.submitted} />
                </View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => this.setState({ modalVisible: false })}>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <View style={[style[this.state.theme].ViewStyle, {
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: 200,
                            width: '90%',
                            borderWidth: 1,
                            borderColor: '#555555',
                            borderRadius: 7,
                        }]}>
                            <Text style={style.layOut.text}>Verify It's You</Text>
                            <TextInput autoFocus={true} placeholder="Enter the code send to your email" placeholderTextColor="#555555" style={[style[this.state.theme].text, style.layOut.textInput]} />
                            <View style={{ marginTop: 5, flexDirection: "row", width: "80%", justifyContent: 'space-between', alignSelf: "center" }}>
                                <Button title="Cancel" color="#555555" onPress={() => this.setState({ modalVisible: false })} />
                                <Button title="submit" color="#555555" onPress={this.SignUp} />
                            </View>

                        </View>
                    </View>
                </Modal>
            </ScrollView>
        )
    }
}
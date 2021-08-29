import React from 'react';
import globe from '../globe'
import {
    StyleSheet,
    Image,
    Button,
    View,
    TextInput,
    BackHandler,
    ScrollView
} from 'react-native';
const style = {
    dark: StyleSheet.create({
        ViewStyle: {
            backgroundColor: '#000000',
            height: "100%"
        }, textInput: {
            color: "#ffffff",
            borderBottomColor: "#ffffff"
        }
    }),
    light: StyleSheet.create({
        ViewStyle: {
            backgroundColor: '#ffffff',
            height: "100%"
        }, textInput: {
            color: "#000000",
            borderBottomColor: "#000000"
        }
    }),
    layOut: StyleSheet.create({
        text: {

            alignSelf: "center",
            fontSize: 25,
            fontFamily: "Roboto",
            marginTop: 10
        }, textInput: {
            alignSelf: "center"
            , width: "80%"
            , borderBottomWidth: 0.5
        },
    })
}
export default class ResetPassword extends React.Component {
    static navigationOptions = {
        header: null
    };
    state = { theme:globe.theme }
    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => { this.props.navigation.goBack() })
        this.setState(({theme})=>({image:theme == "dark" ? require("../Images/darkLogo.png") : require("../Images/lightLogo.png")}));
    }
    componentWillUnmount() {
        this.backHandler.remove()
    }
    render() {
        return (
            <ScrollView style={style[this.state.theme].ViewStyle}>
                <Image source={this.state.image} style={{width:"100%"}} resizeMode="contain" />
                <TextInput placeholder="Enter the code sent to your email" placeholderTextColor="#555555" style={[style.layOut.textInput, style[this.state.theme].textInput]} onSubmitEditing={()=>this.secondTextInput.focus()} />
                <TextInput autoCompleteType="password" placeholder="New password" placeholderTextColor="#555555" style={[style.layOut.textInput, style[this.state.theme].textInput]} ref={(input) => this.secondTextInput = input} onSubmitEditing={()=>this.secondTextInput.focus()}/>
                <TextInput autoCompleteType="password" placeholder="Confirm password" placeholderTextColor="#555555" style={[style.layOut.textInput, style[this.state.theme].textInput]} ref={(input) => this.thirdTextInput = input} />
                <View style={{ flexDirection: "row", width: "80%", justifyContent: 'space-between', alignSelf: "center", marginTop: 10 }}>
                    <Button title="Cancel" color="#555555" onPress={()=>this.props.navigation.goBack()} />
                    <Button title="Reset Password" color="#555555" />
                </View>
            </ScrollView>

        )
    }
}
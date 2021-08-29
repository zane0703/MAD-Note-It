import React from "react";
import {TouchableHighlight,Text} from "react-native";
import PropTypes from 'prop-types';
class CustomButton extends React.Component {
    render() {
        let { colour, disabled, onPress, children, backgroundColour, underlayColour } = this.props;
        return (<TouchableHighlight underlayColor={underlayColour} onPress={onPress} style={{ borderColor: "#555555", borderWidth: 1, justifyContent: "center", backgroundColor:backgroundColour, width: 105 }} disabled={disabled}>
            <Text style={ {  marginVertical: 5,
            marginHorizontal: 0,
            fontSize: 20,
            fontWeight: "bold",
            alignSelf: "center",
            minWidth: 70,color: colour}}>{children}</Text>
        </TouchableHighlight>)
    }
}
CustomButton.propTypes={
    onPress:PropTypes.func.isRequired,
    underlayColor:PropTypes.string,
    disabled:PropTypes.bool,
    backgroundColour:PropTypes.string,
    colour:PropTypes.string,
    children:PropTypes.string
}
export default CustomButton;
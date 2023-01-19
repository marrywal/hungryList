import { ColorSchemeName, StatusBar, StyleSheet } from "react-native";
import React from "react";
import useColorScheme from "../../hooks/useColorScheme";
import { Colors } from "../Colors";

const defaults = StyleSheet.create({
    flexRowCenter: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
})

const getGlobalStyles = (scheme: NonNullable<ColorSchemeName>) => StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
    },
    containerBox: {
        paddingTop: 20,
        paddingHorizontal: 15,
        backgroundColor: Colors[scheme].background,
    },
    emptyScreen: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
    },
    emptyScreenText: {
        color: Colors[scheme].placeholder,
        fontSize: 16,
        marginBottom: 15,
    },
    emptyScreenTextWithoutMargin: {
        color: Colors[scheme].placeholder,
        fontSize: 16
    },
    item: {
        paddingVertical: 0,
        paddingLeft: 0,
        paddingRight: 15,
        borderBottomWidth: 0.25,
        borderBottomColor: Colors[scheme].border,
        justifyContent: 'space-between',
        backgroundColor: 'transparent',
        ...defaults.flexRowCenter
    },
    shoppingItem: {
        borderBottomWidth: 0.25,
        borderBottomColor: Colors[scheme].border,
        ...defaults.flexRowCenter,
        width: '100%',
    },
    itemContent: {
        flex: 1,
        ...defaults.flexRowCenter,
        justifyContent: 'space-between',
        backgroundColor: 'transparent'
    },
    itemButton: {
        ...defaults.flexRowCenter,
        justifyContent: 'flex-start',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    settingsItem: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderBottomWidth: 0.25,
        borderBottomColor: Colors[scheme].border,
        ...defaults.flexRowCenter,
        justifyContent: 'space-between',
        backgroundColor: 'transparent'
    },
    titleBox: {
        flex: 1,
    },
    title: {
        fontSize: 18,
    },
    titleBig: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    titleWithSpace: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20
    },
    subtitle: {
        ...defaults.flexRowCenter,
        marginTop: 3,
    },
    subtitleText: {
        fontSize: 14,
        color: Colors[scheme].secondaryText,
    },
    searchbar: {
        backgroundColor: Colors[scheme].input,
        paddingVertical: 9,
        paddingRight: 13,
        paddingLeft: 35,
        fontSize: 15,
        borderRadius: 8,
        color: Colors[scheme].text,
        width: '100%',
        flex: 1,
    },
    searchIcon: {
        color: Colors[scheme].placeholder,
        paddingVertical: 9,
        paddingLeft: 13,
        marginVertical: 10,
        marginLeft: 13,
        position: 'absolute',
        zIndex: 1,
    },
    inputContainer: {
        paddingVertical: 12,
        paddingHorizontal: 15,
        backgroundColor: Colors[scheme].background,
        display: 'flex',
        flexDirection: 'row',
    },
    inputContainerBottom: {
        borderTopWidth: 0.25,
        borderTopColor: Colors[scheme].border,
    },
    inputContainerTop: {
        borderBottomWidth: 0.25,
        borderBottomColor: Colors[scheme].border,
    },
    input60: {
        width: '60%',
    },
    input40: {
        width: '40%',
    },
    inputBox2: {
        ...defaults.flexRowCenter,
        justifyContent: 'space-between',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    containerSeparator: {
        borderBottomColor: Colors[scheme].input,
        borderBottomWidth: 1
    },
    containerSeparatorTop: {
        borderTopColor: Colors[scheme].input,
        borderTopWidth: 1,
        paddingTop: 10,
    },
    secondaryText: {
        color: Colors[scheme].secondaryText,
        width: 18,
        textAlign: 'right'
    },
    smallText: {
        color: Colors[scheme].secondaryText,
    },
    input: {
        marginBottom: 20
    },
    inputMultiline: {
        minHeight: 55,
        maxHeight: 90,
        paddingTop: 9,
        color: Colors[scheme].text
    },
    cardContainer: {
        paddingTop: 20,
        paddingHorizontal: 15,
        backgroundColor: Colors[scheme].background,
        margin: 15,
        borderRadius: 10,
        shadowColor: Colors[scheme].secondaryText,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
    },
    containerButtons: {
        paddingTop: 20,
        paddingHorizontal: 15,
    },
    box: {
        display: 'flex',
        flexDirection: 'row',
        paddingBottom: 20,
    },
    prepStepsCount: {
        fontWeight: 'bold',
        color: Colors[scheme].tint,
        fontSize: 18,
        width: 35,
        lineHeight: 24
    },
    ingredientsAmount: {
        fontWeight: 'bold',
        marginRight: 10,
        fontSize: 18,
        flex: 1,
        textAlign: 'right',
        lineHeight: 24
    },
    content: {
        flex: 3,
        fontSize: 18,
        lineHeight: 24
    },
    personText: {
        fontSize: 16,
    },
    count: {
        fontSize: 14,
        color: Colors[scheme].secondaryText,
    },
    sendInput: {
        flexGrow: 1
    },
    sendButton: {
        backgroundColor: Colors[scheme].tint,
        borderRadius: 50,
        width: 34,
        height: 34,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10
    },
    itemName: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'baseline',
        paddingVertical: 13,
        paddingHorizontal: 20,
        flex: 2,
    },
    itemDetails: {
        borderLeftWidth: 0.5,
        borderLeftColor: Colors[scheme].border,
        paddingVertical: 5,
        paddingHorizontal: 13,
        marginVertical: 10,
        flex: 1,
    },
});

export function useGlobalStyles() {
    const scheme = useColorScheme();

    // We only want to recompute the stylesheet on changes in color.
    const styles = React.useMemo(() => getGlobalStyles(scheme), [scheme]);

    return styles;
}

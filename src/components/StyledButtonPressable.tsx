import useColorScheme from '../hooks/useColorScheme';
import { Colors } from '../constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, PressableProps, StyleSheet } from 'react-native';
import { Text, View } from '../components/Themed';

interface Props extends PressableProps {
    text: string,
    icon: any,
    color: "default" | "default-inverted" | "error",
    disabledButton?: boolean,
    customWidth?: boolean,
}

export function StyledButtonPressable(props: Props) {
    const scheme = useColorScheme();
    const { ...otherProps } = props;

    const styles = StyleSheet.create({
        button: {
            borderRadius: 10,
            height: 45,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 25,
        },
        defaultButton: {
            backgroundColor: Colors[scheme].tint,
            marginBottom: 15,
        },
        deleteButton: {
            marginBottom: 35,
        },
        buttonText: {
            fontSize: 16,
            marginLeft: 5,
            fontWeight: 'bold',
        },
        defaultButtonText: {
            color: Colors[scheme].textOnTint,
        },
        defaultInvertedButtonText: {
            color: Colors[scheme].tint,
        },
        deleteButtonText: {
            color: Colors[scheme].error,
            fontSize: 14,
        },
    });

    const renderButtonContent = () => {
        if (props.color === 'error') {
            return <View style={{ ...styles.button, ...styles.deleteButton }}>
                <MaterialIcons
                    name={props.icon}
                    size={20}
                    color={Colors[scheme].error}
                />
                <Text style={{ ...styles.buttonText, ...styles.deleteButtonText }}>{props.text}</Text>
            </View>
        }

        if (props.color === 'default-inverted') {
            return <View style={{ ...styles.button }}>
                <MaterialIcons
                    name={props.icon}
                    size={26}
                    color={Colors[scheme].tint}
                />
                <Text style={{ ...styles.buttonText, ...styles.defaultInvertedButtonText }}>{props.text}</Text>
            </View>
        }

        return <View style={{ ...styles.button, ...styles.defaultButton }}>
            <MaterialIcons
                name={props.icon}
                size={26}
                color={Colors[scheme].textOnTint}
            />
            <Text style={{ ...styles.buttonText, ...styles.defaultButtonText }}>{props.text}</Text>
        </View>
    }

    return <Pressable
        disabled={props.disabledButton}
        style={({ pressed }) => ({
            opacity: pressed || props.disabledButton ? 0.5 : 1,
            width: props.customWidth ? 'auto' : '100%'
        })}
        {...otherProps}>
        {renderButtonContent}
    </Pressable>;
}
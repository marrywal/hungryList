import useColorScheme from '../hooks/useColorScheme';
import { Colors } from '../constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, PressableProps, StyleSheet } from 'react-native';
import { Text, View } from '../components/Themed';

interface Props extends PressableProps {
    text: string,
    icon: any,
    color: "default" | "error",
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
            marginBottom: 15,
        },
        editButton: {
            backgroundColor: Colors[scheme].tint
        },
        deleteButton: {
            marginBottom: 35,
        },
        buttonText: {
            fontSize: 16,
            marginLeft: 5,
            fontWeight: 'bold',
        },
        editButtonText: {
            color: Colors[scheme].textOnTint,
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

        return <View style={{ ...styles.button, ...styles.editButton }}>
            <MaterialIcons
                name={props.icon}
                size={26}
                color={Colors[scheme].textOnTint}
            />
            <Text style={{ ...styles.buttonText, ...styles.editButtonText }}>{props.text}</Text>
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
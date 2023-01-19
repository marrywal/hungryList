import { ButtonGroup, ButtonGroupProps } from '@rneui/themed';
import useColorScheme from '../hooks/useColorScheme';
import { Colors } from '../constants/Colors';

export function StyledButtonGroup(props: ButtonGroupProps) {
    const scheme = useColorScheme();
    const { ...otherProps } = props;

    const selectGroupContainer = {
        borderColor: Colors[scheme].tint,
        borderRadius: 8,
        width: '100%',
        height: 35,
        marginLeft: 0,
        marginTop: 0,
        marginBottom: 20
    }

    const selectGroupButton = {
        backgroundColor: Colors[scheme].background
    }

    const selectGroupSelectedButton = {
        backgroundColor: Colors[scheme].tint
    }

    const selectGroupInnerBorder = {
        color: Colors[scheme].tint
    }

    const selectGroupText = {
        fontSize: 10.5,
        color: Colors[scheme].text
    }

    return <ButtonGroup
        containerStyle={[selectGroupContainer]}
        buttonStyle={[selectGroupButton]}
        selectedButtonStyle={[selectGroupSelectedButton]}
        textStyle={[selectGroupText]}
        innerBorderStyle={selectGroupInnerBorder}
        {...otherProps} />;
}
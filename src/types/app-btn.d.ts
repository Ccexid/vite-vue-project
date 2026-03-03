
type ButtonType = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default';
type ButtonNativeType = 'button' | 'submit' | 'reset';
type ButtonSize = 'large' | 'normal' | 'small';
export interface AppBtnProps {
    type?: ButtonType;
    size?: ButtonSize;
    nativeType?: ButtonNativeType;
    disabled?: boolean;
    loading?: boolean;
    plain?: boolean;
    round?: boolean;
    circle?: boolean;
}
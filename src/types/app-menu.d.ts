export interface MenuItem {
    id: string | number;
    label: string;
    icon?: string | Component;
    children?: MenuItem[];
    path?: string;
}
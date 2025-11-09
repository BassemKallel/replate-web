export interface MenuItem {
    label: string;
    icon: string;
    link: string;
    children?: MenuItem[]; // <-- Propriété essentielle pour les sous-menus
}
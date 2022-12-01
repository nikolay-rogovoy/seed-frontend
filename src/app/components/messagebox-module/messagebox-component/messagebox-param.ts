export interface MessageboxParam {
  caption: string;
  text: string;
  showCancel: boolean;
  style: 'primary' | 'success' | 'warning' | 'danger' | 'info';
}
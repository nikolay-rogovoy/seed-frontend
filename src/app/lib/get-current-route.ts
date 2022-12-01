/***/
export function getCurrentRoute(): string {
    let url = window.location.pathname;
    if (url && url.startsWith('/')) {
        url = url.substring(1);
    }
    return url;
}

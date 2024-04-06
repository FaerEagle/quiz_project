export class UrlManager {
    static checkUserData() {
        const name = sessionStorage.getItem('name');
        const lastName = sessionStorage.getItem('lastName');
        const email = sessionStorage.getItem('email');

        if (!name || !lastName || !email) {
            location.href = '#/';
        }
    }

    // Вариант функции для работы с URL-параметрами
    static getQueryParams() {
        const qs = document.location.hash.split('+').join(' ');

        let params = {},
            tokens,
            re = /[?&]([^=]+)=([^&]*)/g;

        while (tokens = re.exec(qs)) {
            params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
        }

        return params;
    }
    static checkUserDataViaUrl(params) {
        const url = new URL(location.href);
        const name = url.searchParams.get('name');
        const lastName = url.searchParams.get('lastName');
        const email = url.searchParams.get('email');

        if (!params.name || !params.lastName || !params.email) {
            location.href = '#/';
        }
    }
}
const ws = new WebSocket("ws://localhost:4567");


ws.onopen = () => {
    ws.onmessage = function (ev) {
        console.log(ev.data);
    };

    let userId = "";

    window.fbAsyncInit = function () {
        const handleLoginStatus = function ({status}) {
            if (status === 'connected') {
                document.querySelector("#login-container").style.display = "none";
                document.querySelector("#user-info").style.display = "block";
                FB.api('/me', {fields: 'first_name'}, function ({id, first_name}) {
                    document.querySelector("#username").innerHTML = `Ingelogd als ${first_name}`;
                    userId = id;
                    ws.send(JSON.stringify({
                        operation: "registerFrameListener",
                        id: id
                    }))
                })
            } else {
                document.querySelector("#login-container").style.display = "block";
                document.querySelector("#user-info").style.display = "none";
            }
        };

        FB.Event.subscribe('auth.authResponseChange', handleLoginStatus);
        FB.getLoginStatus();
    };

    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = "//connect.facebook.net/nl_NL/sdk.js#xfbml=1&version=v2.9&appId=456085871089952";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    document.querySelector("#logout-button").addEventListener('click', () => {
        FB.logout();
        ws.send(JSON.stringify({
            operation: "removeFrameListener",
            id: userId
        }))
    });

    window.addEventListener('beforeunload', () => {
        ws.send(JSON.stringify({
            operation: "removeFrameListener",
            id: userId
        }))
    })
};
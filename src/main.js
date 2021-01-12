import Instances from "./Instances.hbs";
import "./main.scss";

const owncast_instances = [
    "https://watch.owncast.online/",
    "https://tv.grindhold.de/"

];

window.addEventListener('load', function (event) {
    const root = document.getElementById("app-root");
    let instances = [];
    root.innerHTML = Instances({
        instances: instances,
    });

    for (const instance of owncast_instances) {
        fetch(instance + "api/yp")
            .then(response => response.json())
            .then(data => {
                console.log(data);

                const processed = {
                    "name": data.name,
                    "description": data.description,
                    "viewer": data.viewerCount,
                    "thumbnail": instance+"thumbnail.jpg",
                    "status": data.online ? "online" : "offline",
                };

                instances = [...instances, processed];
                root.innerHTML = Instances({
                    instances: instances,
                });
            });
    }
});

/* Events by Grano22 */
export function FloatingContainerEvent(elEvent, evType="toggle", tgClass="floatingContainer", tgActiveClass="active") {
    try {
        if(!(elEvent instanceof Event) && elEvent.__proto__.constructor.name!="SyntheticBaseEvent") throw "Not event type";
        let currCont = elEvent.currentTarget;
        for(let contChild in currCont.children) { 
            if(currCont.children.hasOwnProperty(contChild) && currCont.children[contChild].classList.contains(tgClass)) {
                switch(evType) {
                    case "toggle":
                        currCont.children[contChild].classList.toggle(tgActiveClass);
                    break;
                    case "add":
                        currCont.children[contChild].classList.add(tgActiveClass);
                    break;
                    case "remove":
                        currCont.children[contChild].classList.remove(tgActiveClass);
                }
            }
        }
    } catch(EventError) {
        console.error(EventError);
    }
}

export function FloatingContainerNextToEvent(elEvent, evType="toggle", tgActiveClass="active") {
    try {
        if(!(elEvent instanceof Event) && elEvent.__proto__.constructor.name!=="SyntheticBaseEvent") throw "Not event type";
        let currCont = elEvent.currentTarget;
        for(let contChild in currCont.parentElement.children) {
            if(currCont.parentElement.children.hasOwnProperty(contChild) && currCont.parentElement.children[contChild]==currCont) {
                let nextCont = currCont.parentElement.children[parseInt(contChild) + 1];
                switch(evType) {
                    case "toggle":
                        nextCont.classList.toggle(tgActiveClass);
                    break;
                    case "add":
                        nextCont.classList.add(tgActiveClass);
                    break;
                    case "remove":
                        nextCont.classList.remove(tgActiveClass);
                }
                break;
            }
        }
    } catch(EventError) {
        console.error(EventError);
    }
}


export function FloatingContainerCurrentEvent(elEvent, evType="toggle", tgActiveClass="active") {
    try {
        if(!(elEvent instanceof Event) && elEvent.__proto__.constructor.name!="SyntheticBaseEvent") throw "Not event type";
        let currCont = elEvent.currentTarget;
        switch(evType) {
            case "toggle":
                currCont.classList.toggle(tgActiveClass);
            break;
            case "add":
                currCont.classList.add(tgActiveClass);
            break;
            case "remove":
                currCont.classList.remove(tgActiveClass);
        }
    } catch(EventError) {
        console.error(EventError);
    }
}

/*export function HoverableContainerEvent(elEvent, evType="toggle", tgClass="floatingContainer", tgContentClass="", tgActiveClass="active") {
    try {
        if(!(elEvent instanceof Event)) throw "Not event type";
        let currCont = elEvent.currentTarget;
        for(let contChild in currCont.parentElement.children) {
            if(currCont.children[contChild]==currCont) {
                let nextCont = currCont.children[contChild + 1];
                switch(evType) {
                    case "expand":
                        nextCont.classList.add(tgActiveClass);
                }
                break;
            }
        }
    } catch(EventError) {
        console.error(EventError);
    }
}*/

export function HoverableContainerEvent(elEvent, evType="toggle", tgActiveClass="active") {
    try {
        if(!(elEvent instanceof Event) && elEvent.__proto__.constructor.name!="SyntheticBaseEvent") throw "Not event type";
        let currCont = elEvent.currentTarget;
        switch(evType) {
            case "toggle":
                currCont.classList.toggle(tgActiveClass);
                break;
            case "expand":
                currCont.classList.add(tgActiveClass);
                break;
            case "fold":
                currCont.classList.remove(tgActiveClass);
                break;
        }
    } catch(EventError) {
        console.error(EventError);
    }
}

export class JumperEvents {

}
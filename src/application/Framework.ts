/*
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 3 only, as
 * published by the Free Software Foundation.

 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * version 2 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 */

import { Class } from '../types/Class.js';
import { Properties } from './Properties.js';
import { CustomTag } from '../tags/CustomTag.js';
import { ComponentFactory } from './interfaces/ComponentFactory.js';


export class Framework
{
    private component:any = null;
    private static taglib:Map<string,CustomTag> = null;

    public eventhandler:EventHandler = null;
    public events:Map<Element,string[][]> = new Map<Element,string[][]>();

    private static initTaglib() : void
    {
        if (Framework.taglib == null)
        {
            Framework.taglib = new Map<string,CustomTag>();
            Properties.TagLibrary.forEach((clazz,tag) => {Framework.addTag(tag,clazz);});
        }
    }

    public static addTag(tag:string,clazz:Class<CustomTag>) : void
    {
        Framework.initTaglib();
        tag = tag.toLowerCase();

        let factory:ComponentFactory = Properties.FactoryImplementationClass;
        let impl:CustomTag = factory.createBean(clazz);

        Framework.taglib.set(tag,impl);
    }

    public static parse(component:any, doc:Element) : Framework
    {
        return(new Framework(component,doc));
    }

    private constructor(component:any, doc:Element)
    {
        Framework.initTaglib();

        this.component = component;
        this.eventhandler = new EventHandler(component);

        if (!Properties.parseTags && !Properties.parseEvents)
            return;

        this.parseDoc(doc);
        this.applyEvents();
    }

    private parseDoc(doc:Element) : void
    {
        if (doc == null) return;

        for (let i = 0; i < doc.childNodes.length; i++)
        {
            let node:Node = doc.children.item(i);
            if (!(node instanceof Element)) continue;

            let element:Element = node;
            let tag:string = element.nodeName.toLowerCase();
            let impl:CustomTag = Framework.taglib.get(tag);

            if (impl != null)
            {
                let replace:Element|string = impl.parse(element);

                if (replace == null)
                {
                    element.remove();
                    element = null;
                }
                else
                {
                    if (typeof replace === "string")
                    {
                        let template:HTMLTemplateElement = document.createElement('template');
                        template.innerHTML = replace; replace = template.content.getRootNode() as Element;
                    }

                    this.parseDoc(replace);
                    element.replaceWith(replace);

                    element = replace;
                }
            }

            if (!(element instanceof DocumentFragment))
            {
                this.addEvents(element);
                this.parseDoc(element);
            }
        }
    }

    private addEvents(element:Element) : void
    {
        if (element == null) return;
        if (!Properties.parseEvents) return;

        let attrnames:string[] = element.getAttributeNames();

        for (let an = 0; an < attrnames.length; an++)
        {
            let attrvalue:string = element.getAttribute(attrnames[an]);
            if (attrvalue != null) attrvalue = attrvalue.trim();

            let evtype:boolean = attrnames[an].startsWith("on");
            let handle:boolean = attrvalue != null && attrvalue.startsWith("this.");

            if (evtype && handle)
            {
                let events:string[][] = this.events.get(element);

                if (events == null)
                {
                    events = [];
                    this.events.set(element,events);
                }

                events.push([attrnames[an],attrvalue]);
                element.removeAttribute(attrnames[an]);
            }
        }
    }

    private applyEvents() : void
    {
        if (Properties.parseEvents && this.component != null)
        {
            this.events.forEach((event,element) =>
            {
                for (let i = 0; i < event.length; i++)
                {
                    let func:DynamicCall = new DynamicCall(event[i][1]);
                    let ename:string = this.eventhandler.addEvent(element,event[i][0],func);
                    element.addEventListener(ename,this.eventhandler);
                }
            });
        }
    }
}


export class DynamicCall
{
    public method:string;
    public args:string[] = [];

    constructor(signature:string)
    {
        this.parse(signature);
    }

    private parse(signature:string) : void
    {
        if (signature.startsWith("this."))
            signature = signature.substring(5);

        let pos1:number = signature.indexOf("(");
        let pos2:number = signature.indexOf(")");

        this.method = signature.substring(0,pos1);
        let arglist:string = signature.substring(pos1+1,pos2).trim();

        let n:number = 0;
        let arg:string = "";
        let quote:string = null;

        for(let i=0; i < arglist.length; i++)
        {
            let c:string = arglist.charAt(i);

            if (c == "," && quote == null)
            {
                if (arg.length > 0)
                {
                    this.args.push(arg);
                    n++;
                    arg = "";
                }

                continue;
            }

            if (c == "'" || c == '"')
            {
                if (quote != null && c == quote)
                {
                    n++;
                    quote = null;
                    continue;
                }

                else

                if (quote == null)
                {
                    quote = c;
                    continue;
                }
            }

            arg += c;
        }

        if (this.args.length < n)
            this.args.push(arg);
    }
}


class EventHandler implements EventListenerObject
{
    private events:Map<Element,Map<string,DynamicCall>> =
        new Map<Element,Map<string,DynamicCall>>();

    constructor(private component:any) {}

    public addEvent(element:Element,event:string,handler:DynamicCall) : string
    {
        event = event.substring(2); // get rid of "on" prefix
        let events:Map<string,DynamicCall> = this.events.get(element);

        if (events == null)
        {
            events = new Map<string,DynamicCall>();
            this.events.set(element,events);
        }

        events.set(event,handler);
        return(event);
    }

    public getEvent(element:Element,event:string) : DynamicCall
    {
        let events:Map<string,DynamicCall> = this.events.get(element);
        if (events == null) return(null);
        return(events.get(event));
    }

    public handleEvent(event:Event): void
    {
        let elem:Element = event.target as Element;
        let invoke:DynamicCall = this.getEvent(elem,event.type);

        if (invoke == null)
        {

            while (invoke == null && elem.parentElement != null)
            {
                elem = elem.parentElement;
                invoke = this.getEvent(elem,event.type);
            }
        }

        if (invoke != null)
        {
            try
            {
                switch(invoke.args.length)
                {
                    case 0: this.component[invoke.method](); break;
                    case 1: this.component[invoke.method](invoke.args[0]); break;
                    default: this.component[invoke.method](...invoke.args);
                }
            }
            catch (error)
            {
                console.error("Failed to invoke method: '"+invoke.method+"' on component: "+this.component.constructor.name);
            }
        }
    }
}
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

import { KeyCodes } from "./KeyCodes.js";
import { Class } from "../../types/Class.js";
import { BrowserEvent } from "../../view/BrowserEvent.js";

export class KeyMap
{
	public static copy:KeyMap = new KeyMap({key: 'c', ctrl: true});
	public static undo:KeyMap = new KeyMap({key: 'z', ctrl: true});
	public static paste:KeyMap = new KeyMap({key: 'v', ctrl: true});
	public static requery:KeyMap = new KeyMap({key: 'u', ctrl: true});

	public static now:KeyMap = new KeyMap({key: ' ', ctrl: true}, "now", "Todays date");
	public static dump:KeyMap = new KeyMap({key: KeyCodes.f12, shift: true});

	public static commit:KeyMap = new KeyMap({key: KeyCodes.f10},"commit","commit all transactions");
	public static rollback:KeyMap = new KeyMap({key: KeyCodes.f10, shift: true},"rollback","rollback all transactions");

	public static enterquery:KeyMap = new KeyMap({key: KeyCodes.f7},"enter query","start query by example mode");
	public static executequery:KeyMap = new KeyMap({key: KeyCodes.f8},"execute query","execute query");
	public static queryeditor:KeyMap = new KeyMap({key: KeyCodes.f7, ctrl: true},"query editor","enter advanced query criterias");

	public static space:KeyMap = new KeyMap({key: ' '});
	public static enter:KeyMap = new KeyMap({key: KeyCodes.Enter});
	public static escape:KeyMap = new KeyMap({key: KeyCodes.Escape});

	public static pageup:KeyMap = new KeyMap({key: KeyCodes.ArrowUp, shift:true},"previous page","scroll up");
	public static pagedown:KeyMap = new KeyMap({key: KeyCodes.ArrowDown, shift:true},"next page","scroll down");

	public static nextfield:KeyMap = new KeyMap({key: KeyCodes.Tab});
	public static prevfield:KeyMap = new KeyMap({key: KeyCodes.Tab, shift: true});

	public static prevrecord:KeyMap = new KeyMap({key: KeyCodes.ArrowUp});
	public static nextrecord:KeyMap = new KeyMap({key: KeyCodes.ArrowDown});

   public static prevblock:KeyMap = new KeyMap({key: KeyCodes.PageUp},"previous block","go to previous block");
	public static nextblock:KeyMap = new KeyMap({key: KeyCodes.PageDown},"next block","go to next block");

	public static delete:KeyMap = new KeyMap({key: KeyCodes.f6},"delete","delete record");

	public static insert:KeyMap = new KeyMap({key: KeyCodes.f5},"insert","insert record");
	public static insertAbove:KeyMap = new KeyMap({key: KeyCodes.f5, shift: true},"insert above","insert record above the current");

	public static lov:KeyMap = new KeyMap({key: KeyCodes.f9},"list of values","show valid values");
	public static calendar:KeyMap = new KeyMap({key: KeyCodes.f9},"datepicker","show datepicker");

	public static from(key:string) : KeyMap
	{
		return(KeyMap[key]);
	}

	public static list() : string[][]
	{
		let list:string[][] = [];

		Object.keys(KeyMap).forEach((mapped) =>
		{
			if (KeyMap[mapped] != null && (KeyMap[mapped] instanceof KeyMap))
			{
				if (KeyMap[mapped].name && KeyMap[mapped].desc)
				{
					let key:string[] = [];
					key.push(KeyMap[mapped].toString());
					key.push(KeyMap[mapped].name);
					key.push(KeyMap[mapped].desc);
					list.push(key);
				}
			}
		});

		return(list);
	}

	private key$:string;
	private name$:string;
	private desc$:string;
	private alt$:boolean;
	private ctrl$:boolean;
	private meta$:boolean;
	private shift$:boolean;

	private signature$:string = null;

	public constructor(def:KeyDefinition, name?:string, desc?:string)
	{
		if (def.shift == null)
		{
			if (def.key == def.key.toUpperCase() && def.key != def.key.toLowerCase())
				def.shift = true;
		}

		this.name = name;
		this.desc = desc;

		this.key$ = def.key.toLowerCase();

		this.alt$ = (def.alt ? true : false);
		this.ctrl$ = (def.ctrl ? true : false);
		this.meta$ = (def.meta ? true : false);
		this.shift$ = (def.shift ? true : false);

		this.signature$ = ""+this.key$ + "|";

		this.signature$ += (this.alt$   ? 't' : 'f');
		this.signature$ += (this.ctrl$  ? 't' : 'f');
		this.signature$ += (this.meta$  ? 't' : 'f');
		this.signature$ += (this.shift$ ? 't' : 'f');
	}

	public get name() : string
	{
		return(this.name$);
	}

	public set name(name:string)
	{
		this.name$ = name;
	}

	public get desc() : string
	{
		return(this.desc$);
	}

	public set desc(desc:string)
	{
		this.desc$ = desc;
	}

	public get key() : string
	{
		return(this.key$);
	}

	public get alt() : boolean
	{
		return(this.alt$);
	}

	public get ctrl() : boolean
	{
		return(this.ctrl$);
	}

	public get meta() : boolean
	{
		return(this.meta$);
	}

	public get shift() : boolean
	{
		return(this.shift$);
	}

	public get signature() : string
	{
		return(this.signature$);
	}

	public toString() : string
	{
		let str:string = "";

		if (this.ctrl$)
			str += "ctrl";

		if (this.alt$)
		{
			if (str.length > 0) str += " +";
			str += "alt";
		}

		if (this.shift$)
		{
			if (str.length > 0) str += " +";
			str += "shift";
		}

		if (this.meta$)
		{
			if (str.length > 0) str += " +";
			str += "meta";
		}

		if (str.length > 0)
			str += " ";

		str += this.key$;
		return(str);
	}
}

export interface KeyDefinition
{
	key:string;
	alt?:boolean;
	ctrl?:boolean;
	meta?:boolean;
	shift?:boolean;
}

export class KeyMapping
{
	private static map:Map<string,KeyMap> = null;

	public static init() : void
	{
		KeyMapping.map = new Map<string,KeyMap>();

		Object.keys(KeyMap).forEach((mapped) =>
		{
			if (KeyMap[mapped] != null && (KeyMap[mapped] instanceof KeyMap))
				KeyMapping.add(KeyMap[mapped]);
		});
	}

	public static update(map:Class<KeyMap>) : void
	{
		Object.keys(map).forEach((mapped) =>
		{
			if (map[mapped] != null && (map[mapped] instanceof KeyMap))
			{
				let existing:KeyMap = KeyMapping.get(map[mapped].signature);

				if (existing == null) KeyMapping.add(map[mapped]);
				else map[mapped] = KeyMapping.get(map[mapped].signature);
			}
		});
	}

	public static isRowNav(key:KeyMap) : boolean
	{
		switch(key)
		{
			case KeyMap.prevfield : return(true);
			case KeyMap.nextfield : return(true);
			default 			  		 : return(false);
		}
	}

	public static isBlockNav(key:KeyMap) : boolean
	{
		switch(key)
		{
			case KeyMap.pageup 	  : return(true);
			case KeyMap.pagedown   : return(true);
			case KeyMap.prevrecord : return(true);
			case KeyMap.nextrecord : return(true);
			default 			   	  : return(false);
		}
	}

	public static isFormNav(key:KeyMap) : boolean
	{
		switch(key)
		{
			case KeyMap.prevblock : return(true);
			case KeyMap.nextblock : return(true);
			default 			  		 : return(false);
		}
	}

	public static add(keymap:KeyMap) : void
	{
		if (keymap != null && KeyMapping.map.get(keymap.signature) == null)
			KeyMapping.map.set(keymap.signature,keymap);
	}

	public static get(signature:string, validated?:boolean) : KeyMap
	{
		if (!validated)
			signature = KeyMapping.complete(signature);

		let key:KeyMap = KeyMapping.map.get(signature);

		if (key == null) key = KeyMapping.create(signature);
		return(key);
	}

	public static parseBrowserEvent(event:BrowserEvent) : KeyMap
	{
		if (event.key == null) return(null);
		let key:string = event.key.toLowerCase();

		let signature:string = key+"|";
		signature += event.alt ? 't' : 'f';
		signature += event.ctrl ? 't' : 'f';
		signature += event.meta ? 't' : 'f';
		signature += event.shift ? 't' : 'f';

		return(KeyMapping.get(signature,true));
	}

	private static complete(signature:string) : string
	{
		let pos:number = signature.indexOf('|');

		if (pos <= 0)
		{
			signature += "|";
			pos = signature.length - 1;
		}

		while(signature.length - pos < 5)
			signature += 'f';

		return(signature);
	}

	private static create(signature:string) : KeyMap
	{
		let pos:number = signature.indexOf('|');
		let key:string = signature.substring(0,pos);

		let a:string = signature.substring(pos+1,pos+2);
		let c:string = signature.substring(pos+2,pos+3);
		let m:string = signature.substring(pos+3,pos+4);
		let s:string = signature.substring(pos+4,pos+5);

		let def:KeyDefinition =
		{
			key: key,
			alt: (a == 't' ? true : false),
			ctrl: (c == 't' ? true : false),
			meta: (m == 't' ? true : false),
			shift: (s == 't' ? true : false),
		};

		let keymap:KeyMap = new KeyMap(def);
		KeyMapping.map.set(keymap.signature,keymap);

		return(keymap);
	}
}
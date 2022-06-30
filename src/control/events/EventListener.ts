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

import { Form } from "../../public/Form.js";
import { EventFilter } from "./EventFilter.js";

export class EventListener
{
	public method:string;
	public filters:EventFilter;

	constructor(public id:object, public form:Form, public clazz:any, method:Function|string, public filter:EventFilter)
	{
		if (typeof method === "string")
		{
			this.method = method;

			if (form[this.method] == null)
				throw "@EventListener: method '"+this.method+"' does not exist on form '"+form.constructor.name+"'";
		}
		else
		{
			this.method = method.name;

			if (form[this.method] == null)
				throw "@EventListener: method '"+this.method+"' does not exist on form '"+form.constructor.name+"'";

			if (form[this.method] != method)
				throw "@EventListener: method '"+this.method+"' does not match method defined on form '"+form.constructor.name+"'";
		}
	}

	public toString() : string
	{
		let str:string = this.method;
		if (this.filter) str += JSON.stringify(this.filter);
		return(str);
	}
}
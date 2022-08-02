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

import { Row } from "./Row.js";
import { Record } from "../model/Record.js";
import { FieldProperties } from "../public/FieldProperties.js";

export class RecordProperties
{
	// record -> field -> clazz -> props
	propmap$:Map<object,Map<string,Map<string,FieldProperties>>> =
		new Map<object,Map<string,Map<string,FieldProperties>>>();

	public clear() : void
	{
		this.propmap$.clear();
	}

	public get(record:Record, field:string, clazz:string) : FieldProperties
	{
		return(this.propmap$.get(record.id)?.get(field)?.get(clazz));
	}

	public set(record:Record, field:string, clazz:string, props:FieldProperties) : void
	{
		let rmap:Map<string,Map<string,FieldProperties>> = this.propmap$.get(record.id);

		if (rmap == null)
		{
			rmap = new Map<string,Map<string,FieldProperties>>();
			this.propmap$.set(record.id,rmap);
		}

		let fmap:Map<string,FieldProperties> = rmap.get(field);

		if (fmap == null)
		{
			fmap = new Map<string,FieldProperties>();
			rmap.set(field,fmap);
		}

		fmap.set(clazz,props);
	}

	public delete(record:Record, field:string, clazz:string) : void
	{
		this.propmap$.get(record.id)?.get(field)?.delete(clazz);
	}

	public apply(row:Row, record:Record) : void
	{
		let rmap:Map<string,Map<string,FieldProperties>> = this.propmap$.get(record.id);
		if (rmap == null) return;

		row.getFields().forEach((fld) =>
		{
			let fmap:Map<string,FieldProperties> = rmap.get(fld.name);

			if (fmap != null)
			{
				let classes:string[] = [...fmap.keys()];

				fld.getInstances().forEach((inst) =>
				{
					for (let i = 0; i < classes.length; i++)
					{
						if (inst.properties.hasClass(classes[i]))
							console.log("Apply record props");
					}
				})
			}
		});
	}
}

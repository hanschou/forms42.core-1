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

import { Row } from "../Row.js";
import { Form } from "../Form.js";
import { Block } from "../Block.js";
import { FieldInstance } from "./FieldInstance.js";
import { EventType } from "../../events/EventType.js";
import { Form as Interface } from "../../public/Form.js";
import { BrowserEvent as Event} from "./BrowserEvent.js";
import { Event as FormEvent, Events } from "../../events/Events.js";


export class Field
{
	private row$:Row = null;
	private name$:string = null;
	private block$:Block = null;
	private form$:Interface = null;
	private instances:FieldInstance[] = [];

	public static create(form:Interface, block:string, rownum:number, field:string) : Field
	{
		let frm:Form = Form.getForm(form);
		if (frm == null) return(null);

		let blk:Block = frm.getBlock(block);

		if (blk == null)
		{
			blk = new Block(form,block);
			frm.addBlock(blk);
		}

		let row:Row = blk.getRow(rownum);

		if (row == null)
		{
			row = new Row(blk,rownum);
			blk.addRow(row);
		}

		let fld:Field = row.getField(field);

		if (fld == null)
		{
			fld = new Field(form,blk,row,field);
			row.addField(fld);
		}

		return(fld);
	}

	constructor(form:Interface, block:Block, row:Row, name:string)
	{
		this.row$ = row;
		this.name$ = name;
		this.form$ = form;
		this.block$ = block;
	}

	public get row() : Row
	{
		return(this.row$);
	}

	public get name() : string
	{
		return(this.name$);
	}

	public get block() : Block
	{
		return(this.block$);
	}

	public add(instance:FieldInstance) : void
	{
		this.instances.push(instance);
	}

	public getInstances() : FieldInstance[]
	{
		return(this.instances);
	}

	public setValue(value:any) : boolean
	{
		return(this.distribute(null,value));
	}

	public getValue() : any
	{
		return(this.instances[0].getValue());
	}

	public getStringValue() : string
	{
		return(this.instances[0].getStringValue());
	}

	public async handleEvent(inst:FieldInstance, event:Event)
	{
		if (event.type == "focus")
		{
			if (await this.block.setCurrentRow(inst))
				await this.fire(EventType.PreField);
		}

		if (event.type == "blur")
		{
			await this.fire(EventType.PostField);
		}

		if (event.type == "change")
		{
			if (!await this.fire(EventType.PostChange))
				inst.setError(true);
		}

		if (event.modified)
		{
			this.distribute(inst,inst.getStringValue());
			this.block.distribute(this,inst.getStringValue());
		}
	}

	public distribute(inst:FieldInstance, value:string) : boolean
	{
		let errors:boolean = false;

		this.instances.forEach((fi) =>
		{
			if (fi != inst)
			{
				if (!fi.setValue(value))
					errors = true;
			}
		});

		return(errors);
	}

	private async fire(type:EventType) : Promise<boolean>
	{
		let event:FormEvent = FormEvent.newFieldEvent(type,this.form$,this.block.name,this.name)
		return(Events.raise(event));
	}
}
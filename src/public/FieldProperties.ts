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
import { Alert } from '../application/Alert.js';
import { DataType } from '../view/fields/DataType.js';
import { DataMapper } from '../view/fields/DataMapper.js';
import { BasicProperties } from '../view/fields/BasicProperties.js';
import { FieldFeatureFactory } from '../view/FieldFeatureFactory.js';

export class FieldProperties extends BasicProperties
{
	constructor(properties:BasicProperties)
	{
		super();

		if (properties != null)
			FieldFeatureFactory.copyBasic(properties,this);
	}

	public clone() : FieldProperties
	{
		return(new FieldProperties(this));
	}

	public setTag(tag:string) : FieldProperties
	{
		this.tag = tag;
		return(this);
	}

	public setType(_type:DataType) : FieldProperties
	{
		Alert.fatal("Data type cannot be changed","Properties");
		return(this);
	}

	public setEnabled(flag:boolean) : FieldProperties
	{
		this.enabled = flag;
		return(this);
	}

	public setReadOnly(flag:boolean) : FieldProperties
	{
		this.readonly = flag;
		return(this);
	}

	public setDerived(_flag:boolean) : FieldProperties
	{
		Alert.fatal("Derived cannot be changed","Properties");
		return(this);
	}

	public setRequired(flag:boolean) : FieldProperties
	{
		this.required = flag;
		return(this);
	}

	public setHidden(flag:boolean) : FieldProperties
	{
		this.hidden = flag;
		return(this);
	}

	public setStyles(styles:string) : FieldProperties
	{
		this.styles = styles;
		return(this);
	}

	public removeStyle(style:string) : FieldProperties
	{
		super.removeStyle(style);
		return(this);
	}

	public setClass(clazz:string) : FieldProperties
	{
		super.setClass(clazz);
		return(this);
	}

	public setClasses(classes:string|string[]) : FieldProperties
	{
		super.setClasses(classes);
		return(this);
	}

	public removeClass(clazz:any) : FieldProperties
	{
		super.removeClass(clazz);
		return(this);
	}

	public setAttribute(attr:string, value?:any) : FieldProperties
	{
		super.setAttribute(attr,value);
		return(this);
	}

	public setAttributes(attrs:Map<string,string>) : FieldProperties
	{
		super.setAttributes(attrs);
		return(this);
	}

	public removeAttribute(attr:string) : FieldProperties
	{
		super.removeAttribute(attr);
		return(this);
	}

	public setValue(value:string) : FieldProperties
	{
		this.value = value;
		return(this);
	}

    public setValidValues(values: string[] | Set<string> | Map<string,string>) : FieldProperties
	{
		this.validValues = values;
		return(this);
	}

	public setMapper(mapper:Class<DataMapper>|DataMapper|string) : FieldProperties
	{
		super.setMapper(mapper);
		return(this);
	}
}

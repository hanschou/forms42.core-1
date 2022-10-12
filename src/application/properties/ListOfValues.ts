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

import { BindValue } from "../../database/BindValue.js";
import { QueryFunction } from "../../public/QueryFunction.js";
import { DataSource } from "../../model/interfaces/DataSource.js";

export class ListOfValues
{
	public rows:number = 8;
	public title:string = null;
	public query:QueryFunction;
	public cssclass:string = null;
	public autoquery:boolean = false;
	public bindvalue:BindValue = null;
	public datasource:DataSource = null;
	public displayfields:string|string[];
}
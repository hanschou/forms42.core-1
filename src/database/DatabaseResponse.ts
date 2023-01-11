/*
  Copyright © 2023 Alex Høffner

  Permission is hereby granted, free of charge, to any person obtaining a copy of this software
  and associated documentation files (the “Software”), to deal in the Software without
  restriction, including without limitation the rights to use, copy, modify, merge, publish,
  distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the
  Software is furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all copies or
  substantial portions of the Software.

  THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
  BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
  DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

export class DatabaseResponse
{
	private response$:any;
	private columns$:string[] = [];
	private converted$:boolean = false;

	constructor(response:any, columns?:string[])
	{
		this.response$ = response;

		if (columns != null)
		{
			for (let i = 0; i < columns.length; i++)
				this.columns$.push(columns[i].toLowerCase());
		}
	}

	public get failed() : boolean
	{
		return(!this.response$.success);
	}

	public getValue(column:string) : any
	{
		if (!this.response$.rows)
			return(null);

		if (typeof this.response$.rows != "object")
			return(null);

		column = column?.toLowerCase();
		let row:any = this.response$.rows[0];

		if (!Array.isArray(row) && !this.converted$)
		{
			let flat:any[] = [];
			Object.values(row).forEach((val) => flat.push(val));

			row = flat;
			this.converted$ = true;
			this.response$.rows[0] = flat;
		}

		return(row[this.columns$.indexOf(column)]);
	}
}
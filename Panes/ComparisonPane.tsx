import { Path } from "uix/utils/path.ts";
import { template } from "uix/html/template.ts";
import { Component } from "uix/components/Component.ts";
import Markdown from "../Defaults/Markdown.tsx";

type ComparisonHeaderItem = {
	title: string,
	image: URL | string
};
type ComparisonBodyItem = {
	title: string,
	description?: string,
	values: (boolean | string)[]
};
export type ComparisonPaneOptions = {
	items: {
		header: ComparisonHeaderItem[],
		body: ComparisonBodyItem[]
	},
	header?: string
}

@template<ComparisonPaneOptions>((_, {header, items}) =>
	<div>
		{header && <h1>{header}</h1>}
		<table>
			<tbody>
				<tr>
					<th>
						<span></span>
					</th>
					<>
					{
						...(items as any).header.map((item: ComparisonHeaderItem) => <th>
							{item.image && <img src={new Path(item.image)}/>}
							<span>{item.title}</span>

						</th>)
					}
					</>
				</tr>
				<>
					{
						...(items as any).body.map((item: ComparisonBodyItem) => <tr>
							<td>
								<div>
									{item.title}
								</div>
								{
									item.description && 
									<span class="info">
										<Markdown value={item.description}/>
									</span>
								}
							</td>
							<>
								{item.values.map(value => {
									return <td>
										{
											(typeof value === "boolean") ?
												<span class={value ? "yes": "no"}/> :
												<Markdown value={value}/>
										}
									</td>
								})}
							</>
						</tr>
					)}
				</>
			</tbody>
		</table>
	</div>
)
export class ComparisonPane extends Component<{header?: string, items: ComparisonPaneOptions}> {
	
}

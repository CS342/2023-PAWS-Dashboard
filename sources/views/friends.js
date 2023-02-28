import { JetView } from "webix-jet";
import { getFriends } from "models/friends";
import "webix/nstateicon";

export default class FriendsView extends JetView {
	config(){
		return {
			rows:[
				{
					view:"toolbar", css:this.app.config.theme,
					elements:[
						{ width:4 },
						{ view:"label", label:"Friends", localId:"header", width:140 },
						{},
						{
							view:"nstateicon", tooltip:"Show online/all",
							icons:[
								"mdi mdi-toggle-switch-off-outline",
								"mdi mdi-toggle-switch"
							],
							states:[
								"online", "all"
							],
							on:{
								onStateChange:function(state){
									const list = this.$scope.$$("list");
									list.filter("status",this.config.states[state-1]);
									this.$scope.$$("header").setHTML(`Friends ${state? "online" :""} (${list.count()})`);
								}
							}
						},
						{
							view:"nstateicon", tooltip:"Sort bt A-Z",
							icons:[
								"mdi mdi-sort-descending",
								"mdi mdi-sort-ascending"
							],
							states:[
								"asc", "desc"
							],
							on:{
								onStateChange: state => this.$$("list").sort("name",state)
							}
						}
					]
				},
				{
					view:"list", localId:"list",
					css:"persons_list",
					select:true,
					width:260, autoheight:true,
					type:{
						height:65,
						width:"auto",
						template:obj => {
							return `<image class="doctor_photo" src="data/photos/${obj.photo}_1.jpg" />
							<div class="text">
						  		<span class="doctorname">${obj.name}</span>
								<span class="field">${(obj.field)}</span>
								<span class="webix_icon mdi mdi-circle status ${obj.status}"></span>
							</div>`;
						}
					}
				}
			]
		};
	}
	init(){
		const list = this.$$("list");
		list.parse(getFriends());
		this.$$("header").setHTML(`Friends&nbsp;(${list.count()})`);
	}
}
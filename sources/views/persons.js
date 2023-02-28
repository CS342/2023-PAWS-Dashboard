import {JetView} from "webix-jet";
import {persons} from "models/persons";
import "webix/nstateicon";

export default class PersonsView extends JetView {
	config(){
		return {
			css:this.app.config.shadows,
			rows:[
				{
					view:"toolbar", css:this.app.config.theme,
					localId:"toolbar",
					visibleBatch:"default",
					elements:[
						{
							view:"richselect", batch:"default",
							width:182,
							value:"0", css:"patients_filter",
							options:{
								template:obj => `Show ${obj.value}`,
								data:[
									{ id:"1",value:"Inpatients" },
									{ id:"2",value:"Outpatients" },
									{ id:"0",value:"All patients" }
								]
							},
							on:{
								onChange:newv => {
									if (newv == "0") this.$$("list").filter();
									else this.$$("list").filter("type",newv);
								}
							}
						},
						{ batch:"default" },
						{
							view:"text", batch:"search", localId:"search",
							on:{
								onTimedKeyPress(){
									const input = this.getValue().toLowerCase();
									this.$scope.$$("list").filter(obj => {
										return obj.name.toLowerCase().indexOf(input) !== -1;
									});
								}
							}
						},
						{
							view:"nstateicon",
							icons:["mdi mdi-magnify","mdi mdi-close"],
							states:["default","search"],
							on:{
								onStateChange:function(state){
									const batch = this.config.states[state];
									this.$scope.$$("toolbar").showBatch(batch);
									if (batch === "search") this.$scope.$$("search").focus();
								}
							}
						}
					]
				},
				{
					view:"list",
					localId:"list",
					css:"persons_list",
					select:true,
					type:{
						template:obj => `<image class="user_photo" src="data/photos/${obj.photo}_1.jpg" />
							<div class="text">
						  		<span class="username">${obj.name}</span>
						  		<span class="patient">${(obj.type === 1) ? "Inpatient" : "Outpatient"}</span>
							</div>`,
						height:66
					},
					on:{
						onAfterSelect:id => {
							const person = persons.getItem(id);
							this.app.callEvent("person:select",[person]);
						}
					}
				}
			]
		};
	}
	init(){
		const list = this.$$("list");
		list.sync(persons);
		persons.waitData.then(() => list.select(7));

		this.on(this.app,"save:patient:data",data => {
			persons.updateItem(data.id,data);
		});

		this.on(this.app,"record:select",record => {
			list.select(record.id);
			list.showItem(record.id);
		});
	}
}

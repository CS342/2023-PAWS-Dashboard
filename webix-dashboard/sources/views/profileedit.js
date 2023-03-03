import { JetView } from "webix-jet";
import { getProfileData } from "models/profile";
import "webix/multidate";
import "webix/multitime";

export default class ProfileEditView extends JetView {
	config(){
		function isEmail(value){
			return !value || /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@[^@\s]+\.[^2\s]+$/.test(value);
		}

		return {
			view:"form", borderless:true, elements:[
				{
					view:"text", name:"doctor", label:"Name", labelWidth:65,
					validate:webix.rules.isNotEmpty
				},
				{ view:"textarea", name:"about", height:160, label:"About", labelWidth:65, },
				{ label:"Schedule", labelPosition:"top", view:"multitime", name:"schedule" },
				{ view:"label", label:"Contact Info" },
				{ view:"text", label:"Email", name:"email", labelWidth:65, validate:isEmail },
				{ view:"text", label:"Phone", name:"phone", labelWidth:65, pattern:webix.patterns.phone },
				{ view:"text", label:"Address", name:"address", labelWidth:65 },
				{
					// outer layout for multiline control
					rows:[
						{ view:"label", label:"Skills"},
						{ view:"multitext", separator:",", name:"skills" }
					]
				},
				{ label:"Qualification", labelPosition:"top", view:"multidate", name:"qualification"},
				{ view:"textarea", name:"hobbies", height:100, label:"Hobbies", labelWidth:65 }
			]
		};
	}
	init(){
		const form = this.getRoot();
		this._data = getProfileData();
		form.setValues(this._data);

		this.on(this.app,"save:form:data",() => {
			if (form.validate()){
				const formData = form.getValues();
				formData["skills"] = formData["skills"].split(",");
				try{
					webix.storage.session.put("demo_profile_data",formData);
				}
				catch(err){
					webix.message("You blocked cookies. Data won't be saved.");
				}
				this.getParentView().endEdit();
				webix.message("Saved","success");
			}
		});
	}
}
import Service from "../utilities/Service";
import Skill from "../models/Skill.model";

class SkillService extends Service {
	constructor(model) {
		super(model);
	}
}

export default new SkillService(Skill);

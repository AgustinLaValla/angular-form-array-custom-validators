import { Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ValidatorFn,
  FormControl
} from "@angular/forms";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  public empForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.empForm = this.fb.group({
      employees: this.fb.array([this.newEmplooyee()])
    });
  }

  get employees(): FormArray {
    return this.empForm.get("employees") as FormArray;
  }

  employeeSkills(index: number) {
    return this.employees.at(index).get("skills") as FormArray;
  }

  newEmplooyee() {
    return this.fb.group({
      firstname: ["", [Validators.required, Validators.maxLength(30)]],
      lastname: ["", [Validators.required, Validators.maxLength(30)]],
      skills: this.fb.array([])
    });
  }

  addEmployee() {
    this.employees.push(this.newEmplooyee());
  }

  removeEmployee(index: number) {
    this.employees.removeAt(index);
  }

  newSkill(index:number) {
    return this.fb.group({
      skill: ["", [Validators.required, this.validateSkill(index)]],
      exp: ["", [Validators.required]]
    });
  }

  addEmployeeSkill(index: number) {
    this.employeeSkills(index).push(this.newSkill(index));
  }

  removeSkill(empIndex: number, skillIndex: number) {
    this.employeeSkills(empIndex).removeAt(skillIndex);
  }

  onSubmit() {
    console.log(this.empForm);
  }

  validateSkill(index: number): ValidatorFn {
    return (control: FormControl) => {
      const skillsArray = this.employeeSkills(index);
      let valuesCount = 0;
      for (let skill of skillsArray.controls) {
        const skillValue = skill.get("skill").value;
        if (skillValue === control.value) {
          valuesCount += 1;
        }
      }
      if (valuesCount >= 2) {
        return { skillExists: true };
      }
      return null;
    };
  }
}

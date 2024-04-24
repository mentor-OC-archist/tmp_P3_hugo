import APIClass from "./APIClass.js"


export default class MyClass extends APIClass{



    constructor(props) {
        super()
        props && Object.assign(this,props)
        console.log(this)

        this.getWorks()
        this.getCategories()
    }
    


}
const machinchose = new MyClass()
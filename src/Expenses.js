import React, { Component } from 'react';
import AppNav from './AppNav';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './App.css';
import { Container, Form, FormGroup, Button, Table, } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Moment } from 'react-moment';




class Expenses extends Component {

    // {
    //     "id":100,
    //     "location":"New York",
    //     "expenseDate":"2020-06-06T18:30:00Z",
    //     "description":"New York Business Trip",
    //     "category":
    //     {
    //         "id":3,
    //         "name":"Debt"
    //     }
    // }


    emptyItem = {
        id: '103',
        expensedate : new Date(),
        description : '',
        location : '',
        categories : {id:1,name:'Travel'},

    }




    constructor(props){
        super(props);


        this.state = {
            date : new Date(),
            isLoading : true,
            Expenses : [],
            Categories : [],
            item : this.emptyItem,
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
    }

    async remove(id){
        await fetch(`/api/expenses/${id}`, {
            method : "DELETE",
            headers : {
                "Accept" : "application/json",
                "Content-Type" : "application/json"
            }
        }).then(() => {
            let updateExpenses = {...this.state.Expenses}.fill( i => i.id === id);
            this.setState({Expenses: updateExpenses});
        });
    }

    

    async componentDidMount(){
        const response = await fetch(`/api/categories`);
        const body = await response.json();
        
        this.setState({Categories : body, isLoading : false});


         const responseExp = await fetch(`/api/expenses`);
         const bodyExp = await responseExp.json();
        
       // this.setState({Expenses : bodyExp, isLoading : false});
    }


    async handleSubmit(event){
        event.preventDefault();

        const item = this.state;
        
        
        await fetch(`/api/expenses`, {
            method : 'POST',
            headers : {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify (this.item),

        });

        console.log(this.state);
        this.props.history.push('/expenses');
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        let item = {...this.state.item};
        item[name] = value;
        this.setState({
            item
        });
        console.log(this.state.item);
    }

    handleDateChange(date){
        let item = {...this.state.item};
        item.expenseDate = date;

        this.setState({item});

    }



    render() {
        const title = <h3>Add Expense</h3>;
        const {Categories} = this.state;
        const {Expenses, isLoading} = this.state;

        if(isLoading)
            return(<div>Loading....</div>);

        let optionList = 
                Categories.map(
                    categories => 
                    <option id={categories.id} key={categories.id}>
                        {categories.name}
                    </option>
                )

        let rows = Expenses.map(
            expense => 
            <tr key={expense.id}>
                <td>{expense.description}</td>
                <td>{expense.location}</td>
                <td><Moment date={expense.expenseDate} format="YYY/MM/DD"/></td>
                <td>{expense.category.name}</td>
                <td><Button size="5m" color='danger' onClick={() => this.remove(expense.id)}>Delete</Button></td>
            </tr>
        )

        return(
            <div>
                <AppNav/>

               
               
                <Container>
                {title}  

                    <Form onSubmit={this.handleSubmit}>
                       
                       
                        <FormGroup>
                            <label for="title">Title</label>
                            <input type="text" name="title" id="title" onChange={this.handleChange} autoComplete='name'/>
                        </FormGroup>

                        
                        <FormGroup>
                            <label for="category">Category</label>
                            
                            <select>
                                {optionList}
                            </select>

                            <input type="text" name="category" id="category" onChange={this.handleChange}/>
                        </FormGroup>
                   
                        <FormGroup>
                            <label for="expensedate">Expense Date</label>
                            <DatePicker selected={this.state.item.expenseDate} onChange={this.handleDateChange}/>
                        </FormGroup>


                        <div className='row'>
                            <FormGroup className='col-md-4 ab-3'>
                                <label for='location'>Location</label>
                                <input type='text' name='location' id='location' onChange={this.handleChange}/>
                            </FormGroup>
                        </div>
                   
                   
                   <FormGroup>
                       <Button color='primary' type='submit'>Save</Button>{' '}
                       <Button color='secondary' tag={Link} to='/categories'>Cancel</Button>
                   </FormGroup>
                   
                    </Form>

                </Container>


                    {' '}

                    <Container>
                        <h3>Expense List</h3>
                        <Table className='mt-4'>

                            <thead>
                                <tr>
                                    <th width='20%'>
                                        Description

                                    </th>

                                    <th width='10%'>
                                        Location
                                    </th>

                                    <th>
                                        Date
                                    </th>

                                    <th>
                                        Category
                                    </th>

                                    <th width='30%'>
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows}
                            </tbody>

                        </Table>
                    </Container>

            </div>
        );
    }

}

export default Expenses;
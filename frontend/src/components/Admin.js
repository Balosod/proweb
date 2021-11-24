import react, { useState } from 'react'
import { Form, Button, Card, Container, Row, Col} from 'react-bootstrap'
import AdminStore from './AdminStore'
import ErrorMessage from './ErrorMessage'
import S3FileUpload from 'react-s3';



const Admin = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const [productInfo, setProductInfo] = useState(
        {
            title: "",
            description: "",
            price: "",
        }
    )

    const updateForm = (e) => {
        setProductInfo(
            {...productInfo, [e.target.name] : e.target.value}
        )
    }

    const config ={
        bucketName:"storedev",
        dirName:"",
        region:"Oregon",
        accessKeyId:"AKIATYQCI4ZNQB2HRXNW",
        secretAccessKey:"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"
    }

    const upload = (e) => {
        S3FileUpload.uploadFile(e.target.files[0], config)
        .then((data)=>{
            console.log(data.location)
        })
        .catch((err) =>{
            alert(err)
        })
    }

    const postData = async (e) => {
        e.preventDefault();
        const requestOptions = {
            method: "POST",
            headers: {
                "content-Type": "application/json"
            },
            body: JSON.stringify({
                   
                "title": productInfo['title'],
                "description": productInfo['description'],
                "price": productInfo['price'],
            }),
        };
        const response = await fetch ("http://localhost:8000/admin/items", requestOptions);
        console.log(response)
        if(!response.ok){
            setErrorMessage("somethin went wrong")
        }else{
            setErrorMessage("Items successfully Added");
            setProductInfo({
                title: "",
                description: "",
                price: "",
            });
        }

    }

    return (
    <Container>
        <AdminStore>
        </AdminStore>
        <Card>
            <Card.Body>
                <Form onSubmit = {postData}>
                    <Form.Group controlId="ProductName">
                        <Form.Label>Product Name</Form.Label>
                        <Form.Control type="text" name="title" 
                            value={productInfo.title} onChange = {updateForm} placeholder="Product title" />
                    </Form.Group>
                    <Form.Group controlId="Description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control type="text" name="description" value={productInfo.description} onChange = {updateForm}  placeholder="Description" />
                    </Form.Group>
                    <Form.Group controlId="UnitPrice">
                        <Form.Label>Price</Form.Label>
                        <Form.Control type="number" name="price" value={productInfo.price} onChange = {updateForm}  placeholder="Price" />
                    </Form.Group>
                    <Form.Group controlId="UploadFile">
                        <Form.Label>Price</Form.Label>
                        <Form.Control type="file" name="upload" onChange = {upload}  placeholder="Upload Image" />
                    </Form.Group>

                    <Button style={{marginTop:"10px"}} variant="primary" type="submit">
                        Add to Store
                    </Button>
                    <ErrorMessage message={errorMessage}/>
                </Form>
            </Card.Body>
        </Card>
    </Container>
    );
}


export default Admin;
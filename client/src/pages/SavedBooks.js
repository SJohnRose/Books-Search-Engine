import React from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';


import Auth from '../utils/auth';
import { useQuery, useMutation} from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  
  const { loading, error, data } = useQuery(GET_ME);
  const myData = data?.me || {};
  
  
  const [removeBook] = useMutation(REMOVE_BOOK);
  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const {data} = await removeBook({
        variables: {bookId},
      });
    
      removeBookId(bookId);
    } 
    catch (err) {
      console.error(err);
    }
  }
  if(loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;
  
  
  if(myData && myData.savedBooks) {
  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
                     
           <h2>
           {myData.savedBooks.length
            ? `Viewing ${myData.savedBooks.length} saved ${myData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'} 
             
        </h2> 
        <CardColumns>
          {myData.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} border='dark'>
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns> 
      </Container>
    </>
  );
};
}


export default SavedBooks;

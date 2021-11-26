import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import { Formik } from 'formik'

const validate = (values) => {
  const errors = {}
  // title
  if (!values.title) {
    errors.title = 'Required'
  } else if (values.title.length > 50) {
    errors.title = 'Must be 50 characters or less'
  }
  // type
  if (!values.type) {
    errors.type = 'Choose a type'
  }
  // description
  if (!values.description) {
    errors.description = 'Required'
  } else if (values.description.length > 200) {
    errors.description = 'Must be 200 characters or less'
  }
  // instructions
  if (!values.instructions) {
    errors.instructions = 'Required'
  }
  // rules
  if (!values.rules) {
    errors.rules = 'Required'
  }
  // startDate
  if (!values.startDate) {
    errors.startDate = 'Required'
  } else if (false) {
    errors.startDate = 'needs to be a date'
  }
  // startDate
  if (!values.endDate) {
    errors.endDate = 'Required'
  } else if (false) {
    errors.endDate = 'needs to be a date'
  }

  return errors
}

export default function createCompetitionForm() {
  const currentDate = new Date()

  return (
    <Container className={'w-75'}>
      <h2>Create a new competition</h2>
      <Formik
        onSubmit={(values) => {
          alert(JSON.stringify(values, null, 2))
        }}
        validate={validate}
        initialValues={{
          title: '',
          type: null,
          description: '',
          instructions: '',
          rules: '',
          startDate: currentDate.toISOString().slice(0, 16),
          endDate: currentDate.toISOString().slice(0, 16),
        }}
      >
        {({
          handleSubmit,
          handleChange,
          handleBlur,
          values,
          touched,
          isValid,
          errors,
        }) => (
          <Form noValidate onSubmit={handleSubmit}>
            {/* title */}
            <Form.Group className={'mb-3'} controlId="title">
              <Form.Label>Competition title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.title && errors.title}
              />
              <Form.Control.Feedback type="invalid">
                {errors.title}
              </Form.Control.Feedback>
            </Form.Group>
            {/* type */}
            <Form.Group className="mb-3" controlId="type">
              <Form.Label>Competition Type</Form.Label>
              <Form.Select
                name="type"
                value={values.type}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.type && errors.type}
              >
                <option>Select a type</option>
                <option value="Photography">Photography</option>
                <option value="Drawing">Drawing</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.type}
              </Form.Control.Feedback>
            </Form.Group>
            {/* description */}
            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                type="text"
                placeholder="Short description on competition card"
                style={{ height: '100px' }}
                name="description"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.description && errors.description}
              />
              <Form.Control.Feedback type="invalid">
                {errors.description}
              </Form.Control.Feedback>
            </Form.Group>
            {/* instructions */}
            <Form.Group className="mb-3" controlId="instructions">
              <Form.Label>Instructions</Form.Label>
              <Form.Control
                as="textarea"
                type="text"
                placeholder="Enter the instruction needed for the competition"
                style={{ height: '200px' }}
                name="instructions"
                value={values.instructions}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.instructions && errors.instructions}
              />
              <Form.Control.Feedback type="invalid">
                {errors.rules}
              </Form.Control.Feedback>
            </Form.Group>
            {/* rules */}
            <Form.Group className="mb-3" controlId="rules">
              <Form.Label>Rules</Form.Label>
              <Form.Control
                as="textarea"
                type="text"
                placeholder="Rules for the competition"
                style={{ height: '100px' }}
                name="rules"
                value={values.rules}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.rules && errors.rules}
              />
              <Form.Control.Feedback type="invalid">
                {errors.rules}
              </Form.Control.Feedback>
            </Form.Group>
            {/* startDate */}
            <Form.Group className="mb-3" controlId="startDate">
              <Form.Label>Starting date</Form.Label>
              <Form.Control
                type="datetime-local"
                name="startDate"
                value={values.startDate}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.startDate && errors.startDate}
              />
              <Form.Control.Feedback type="invalid">
                {errors.startDate}
              </Form.Control.Feedback>
            </Form.Group>
            {/* endDate */}
            <Form.Group className="mb-3" controlId="endDate">
              <Form.Label>End date</Form.Label>
              <Form.Control
                type="datetime-local"
                name="endDate"
                value={values.endDate}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.endDate && errors.endDate}
              />
              <Form.Control.Feedback type="invalid">
                {errors.endDate}
              </Form.Control.Feedback>
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </Container>
  )
}
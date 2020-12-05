import React, { useState } from "react";
import { Field, FieldArray, FieldProps, Form, Formik, getIn } from "formik";
import { v4 } from "uuid";
import * as yup from "yup";
import "./Form.css";

const Formik_Form: React.FC = () => {
	const validationSchema = yup.object().shape({
		users: yup.array().of(
			yup.object().shape({
				name: yup.string().required("Required").max(10),
				age: yup.number().required("Required").min(1),
			})
		),
	});
	const [formData, setFormData] = useState([{ id: "5", name: "bob", age: 22 }]);

	const handleUpdate = async (i: number, user: any) => {
		let newArr = { ...formData }; // copying the old datas array
		newArr[i] = user; // replace e.target.value with whatever you want to change it to
		await setFormData(newArr); // ?
		console.log(user);
	};
	return (
		<div>
			<h2>Formik Form</h2>
			<Formik
				initialValues={{
					users: formData,
				}}
				onSubmit={async (values: any, { setSubmitting }) => {
					// if (values.users.length !== 1) {
					// 	setFormData(values.users);
					// } else {
					// 	setFormData(values.users);
					// }
					await setFormData(values);
					setSubmitting(false);
				}}
				validationSchema={validationSchema}
			>
				{({ values, handleChange, handleSubmit, errors, isSubmitting }) => (
					<Form onSubmit={handleSubmit}>
						<FieldArray name="users">
							{({ push, remove }) => (
								<div>
									{values.users.map(
										(user: string | number | any, i: number) => {
											const name = `users[${i}].name`;
											const age = `users[${i}].age`;
											const errorMessage = getIn(errors, name);
											const errorMessageForAge = getIn(errors, age);
											return (
												<div>
													<input
														name={name}
														value={user.name}
														onChange={handleChange}
													/>
													{errorMessage && (
														<div style={{ color: "red" }}>{errorMessage}</div>
													)}
													<input
														name={age}
														value={user.age}
														onChange={handleChange}
													/>
													{errorMessageForAge && (
														<div style={{ color: "red" }}>
															{errorMessageForAge}
														</div>
													)}
													<button onClick={() => handleUpdate(i, user)}>
														Update
													</button>
													{values.users.length !== 1 && (
														<button onClick={() => remove(i)}>-</button>
													)}
												</div>
											);
										}
									)}
									<button
										onClick={() =>
											push({
												id: v4(),
												name: "",
												age: "",
											})
										}
									>
										+
									</button>
								</div>
							)}
						</FieldArray>
						<div>
							<button disabled={isSubmitting}>Submit</button>
						</div>
						<pre>{JSON.stringify(values, null, 2)}</pre>
					</Form>
				)}
			</Formik>
		</div>
	);
};

export default Formik_Form;

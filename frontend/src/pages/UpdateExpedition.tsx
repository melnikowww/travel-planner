import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import React, {useEffect, useState} from "react";
import {Accordion, Container, Modal, Row} from "react-bootstrap";
import {Map, Placemark, YMaps} from "@pbe/react-yandex-maps";
import Contacts from "../elements/Contacts.tsx";
import {Expedition, Point } from "../../types.ts";
import axios from "axios";
import FormItem from "antd/es/form/FormItem";
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import {DatePicker, Form, Input} from "antd";
import dayjs, {Dayjs} from "dayjs";
import {GetPopupContainer} from "antd/es/table/interface";
import {Button as BootstrapButton} from "react-bootstrap";
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Props {
	show: boolean
	onHide: () => void
	expeditionId: number
}

interface ExpeditionData {
	name: string,
	description: string,
	starts_at: string | undefined,
	ends_at: string | undefined,
}

interface ExpDTO {
	name: string,
	description: string,
	dates: [Dayjs | undefined | null, Dayjs | undefined | null],
	points: Point[],
}

const UpdExp: React.FC<Props> = ({show, onHide, expeditionId}) => {

	const [changedPoints, setChangedPoints] = useState<any[]>([])
	const [points, setPoints] = useState<Point[]>([])
	const [expedition, setExpedition] = useState<Expedition>()

	const fetchExp = async () => {
		if (show && expeditionId) {
			try {
				const expeditionResponse = await axios.get<Expedition>(`http://localhost:8081/expeditions?id=${expeditionId}`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("authToken")}`
					}
				});
				setExpedition(expeditionResponse.data);
			} catch (err) {
				console.log(err)
			}
		}
	}

	useEffect(() => {
		fetchExp();
	}, []);

	useEffect(() => {
		if (expedition) {
			setPoints(expedition.points)
		}
	}, [expedition?.points]);

	const [markers, setMarkers] = useState<[number, number][]>([]);
	useEffect(() => {
		if (expedition) {
			const newMarkers = expedition.points.map((point) => {
				const coords = point.location.split(',').map(coord => parseFloat(coord.trim()));
				return [coords[0], coords[1]] as [number, number];
			}).filter(coord => !isNaN(coord[0]) && !isNaN(coord[1]));
			setMarkers(newMarkers);
		}
	}, [expedition]);

	return (
		<Modal fullscreen show={show} style={{zIndex:1500, position:'fixed', paddingTop: '0px'}}
			   autoFocus={true} keyboard={true} className='no-scroll'
		>
			{/*<Navbar hide={true} contactsShadow={false} profileShadow={false} aboutShadow={false} expeditionsShadow={false}/>*/}
			<div className='' style={{
				backgroundColor: "rgba(45,45,45,0.8)",
				border: "2px solid #DAA520",
				boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
				color: 'honeydew',
				overflow: 'hidden',
				height:'100vh',
				width: '100vw',
			}}>
				<YMaps
					query={{
						load: "package.full",
						apikey:'6896548d-124b-46a2-866d-67213d6c0a46'
					}}
				>
					<Map
						defaultState={{center: markers.length > 0 ? markers[0] : [59.95, 30.37], zoom: 7}}
						style={{height: '100%', width:'100%'}}
					>
						{markers.map((pnt, index) => (
							<Placemark
								key={`marker-${index}`}
								geometry={[pnt[0], pnt[1]]}
								options={{
									preset: 'islands#blueStretchyIcon',
									draggable: true,
								}}
								properties={{
									hintContent: expedition?.points[index].name,

								}}
								onDragEnd={(e: any) => {
									const newCoords = e.get('target').geometry.getCoordinates();
									const formattedCoords = `${newCoords[0].toFixed(6)},${newCoords[1].toFixed(6)}`;

									setMarkers(prev => prev.map((m, i) =>
										i === index ? [newCoords[0], newCoords[1]] : m
									));

									setPoints(prevState => {
										if (!prevState) return prevState;
										return prevState.map((item, i) =>
											i === index
												? { ...item,  location: formattedCoords}
												: item
										);
									});
									setChangedPoints(prev => {
										const pointId = points[index]?.id;
										return pointId && !prev.includes(pointId)
											? [...prev, pointId]
											: prev;
									});
								}}
							/>
						))}
					</Map>
				</YMaps>
			</div>
			<Container fluid className='d-flex position-absolute' style={{
				zIndex:2000,
				fontFamily:'Rubik',
				width:'100%',
				pointerEvents: 'none',
				paddingLeft: '0',
				paddingRight: '0',
			}}>
				<Row xl={3} className="py-5 mb-3 justify-content-end align-items-start w-100 h-75" >
					{expedition && <FormExp expedition={expedition} points={points} changedPoints={changedPoints} onHide={onHide}/> }
				</Row>
			</Container>
			<Contacts/>
		</Modal>
	)
}

const FormExp = React.memo(({ expedition, points, changedPoints, onHide }: { expedition: Expedition, points: Point[], changedPoints: any[], onHide: ()=> void }) => {
	const [exp] = useState<Expedition>(expedition)
	// const [showPoints, setShowPoints] = useState(false)

	const [showDelete, setShowDelete] = useState(false)

	const {control, handleSubmit, formState: {errors}, reset} = useForm<ExpDTO>({
		defaultValues: {
			name: exp?.name || '',
			description: exp?.description || '',
			dates: [
				exp?.starts_at ? dayjs(exp.starts_at) : null,
				exp?.ends_at ? dayjs(exp.ends_at) : null
			],
			points: exp?.points,
		}
	});

	const {RangePicker} = DatePicker;

	const onSubmit: SubmitHandler<ExpDTO> = async (data) => {
		try {
			if (changedPoints.length > 0 && expedition) {
				const updatePromises = changedPoints.map(pointId => {
					const point = points.find(p => p.id === pointId);
					if (!point) return Promise.resolve();

					return axios.patch(`http://localhost:8081/points?id=${pointId}`, {
						location: point.location,
						expedition_id: expedition.id
					}, {
						headers: {
							Authorization: `Bearer ${localStorage.getItem('authToken')}`,
						}
					});
				});

				await Promise.all(updatePromises);
			}

			const expeditionData: ExpeditionData = {
				name: data.name,
				description: data.description,
				starts_at: data.dates[0]?.toISOString(),
				ends_at: data.dates[1]?.toISOString(),
			};

			await updateExpedition(expeditionData);
			onHide();
		} catch (error) {
			console.error('Ошибка изменения экспедиции:', error);
		}
	};

	const updateExpedition = async (Expedition: ExpeditionData) => {
		const response = await axios.patch<Expedition>('http://localhost:8081/expeditions?id='
			+ expedition?.id,
			Expedition, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				}
			})
		reset(response.data)
	}

	const getPopupContainer: GetPopupContainer = (triggerNode) => triggerNode;
	return (
		<Accordion defaultActiveKey="0" style={{maxWidth: '95vw'}}>

			<Accordion.Item eventKey="0" className='custom-accordion-item'>
				<Accordion.Header className='custom-accordion-header'>
					Основная информация
				</Accordion.Header>
				<Accordion.Body className='custom-accordion-body'>
					<Form
						layout={"horizontal"}
						style={{
							fontFamily: 'Rubik',
							maxWidth: '100%',
						}}
						labelCol={{span: 4}}
						wrapperCol={{span: 20}}
					>
						<FormItem
							label={<span style={{fontFamily: 'Rubik', color: 'whitesmoke'}}>Название</span>}
							validateStatus={errors.name ? 'error' : ''}
							help={errors.name?.message}
							style={{justifySelf: 'center', width: '100%'}}
						>
							<Controller
								name='name'
								control={control}
								rules={{
									required: 'Обязательно!',
									pattern: {
										value: /^[A-Za-zА-Яа-яЁё\s\-]+$/,
										message: 'Только буквы и пробелы!'
									}

								}}
								render={({field}) => (
									<Input
										{...field}
										style={{fontFamily: 'Rubik'}}
										status={errors.name ? 'error' : ''}
									/>
								)}
							>
							</Controller>
						</FormItem>

						<FormItem
							label={<span style={{fontFamily: 'Rubik', color: 'whitesmoke'}}>Описание</span>}
							validateStatus={errors.description ? 'error' : ''}
							help={errors.description?.message}
							style={{justifySelf: 'center', width: '100%'}}
						>
							<Controller
								name='description'
								control={control}
								rules={{
									required: 'Обязательно!',
								}}
								render={({field}) => (
									<Input.TextArea
										{...field}
										style={{fontFamily: 'Rubik', textAlign: 'center',}}
										status={errors.description ? 'error' : ''}
										autoSize={{minRows: 2, maxRows: 10}}
									/>
								)}
							>

							</Controller>
						</FormItem>

						<FormItem
							label={<span style={{fontFamily: 'Rubik', color: 'whitesmoke'}}>Даты</span>}
							validateStatus={errors.dates ? 'error' : ''}
							help={errors.dates?.message}
						>
							<Controller
								name='dates'
								control={control}
								rules={{
									required: 'Обязательно!',
								}}
								render={({field: {value, onChange, ...restField}}) => (
									<RangePicker
										value={value ? [value[0], value[1]] : [null, null]}
										onChange={onChange}
										{...restField}
										style={{fontFamily: 'Rubik', width: '100%'}}
										status={errors.dates ? 'error' : ''}
										picker="date"
										getPopupContainer={getPopupContainer}
									/>
								)}

							/>
						</FormItem>

						<Container className='d-flex'
								   style={{justifyContent: 'center', width: '100%', alignItems: 'center'}}>
							<BootstrapButton
								type='submit'
								className='submit-btn justify-content-center mx-3'
								onClick={handleSubmit(onSubmit)}
							>
								Применить
							</BootstrapButton>
							<BootstrapButton
								variant='outline-danger'
								className=' justify-content-center mx-3'
								onClick={() => {
									reset();
									onHide();
								}}
							>
								Отмена
							</BootstrapButton>
						</Container>
						<div className='d-flex mt-3' style={{
							width: '100%',
							justifyContent: 'center',
							alignItems: 'center'
						}}>
							<BootstrapButton
								variant='danger'
								className=' justify-content-center mx-3'
								style={{background: '#C14545'}}
								onClick={()=>{
									setShowDelete(true)
								}}
							>
								Удалить экспедицию
							</BootstrapButton>
						</div>
					</Form>
				</Accordion.Body>
			</Accordion.Item>

			<Accordion.Item eventKey='1' className='custom-accordion-item'>
				<Accordion.Header className='custom-accordion-header'>
					 Точки маршрута
				</Accordion.Header>
				<Accordion.Body className='custom-accordion-body'>
					<ModalPoints expedition={expedition} points={points}/>
				</Accordion.Body>
			</Accordion.Item>
			{showDelete && <DeleteModal show={showDelete} onHide={() => {setShowDelete(false); onHide()}} expeditionId={expedition.id}/>}
		</Accordion>
	);
})

const SortablePointItem = ({point, index}: { point: Point; index: number }) => {
	const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id: point.id});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		cursor: 'grab',
		backgroundColor: "rgba(45,45,45,0.8)",
		border: "2px solid",
		borderColor: "#DAA520",
		boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
		color: "honeydew",
		height: '100%',
		width: '100%',
		borderRadius: '15px',
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			className="point-item mb-2 p-2 text-center"
		>
			{index + 1}. {point.name}
		</div>
	);
};

interface PointsProps {
	expedition: Expedition
	points: Point[],
	// show: boolean,
	// onHide: () => void
}

const ModalPoints: React.FC<PointsProps> = ({expedition, points}) => {
	const [pnts, setPoints] = useState<Point[]>(points);

	useEffect(() => {
		setPoints(points.sort((a, b) => a.position - b.position))
	}, [points]);

	const handleDragEnd = (event: DragEndEvent) => {
		const {active, over} = event;
		if (!over || active.id === over.id) return;
		setPoints((items) => {
			const oldIndex = items.findIndex(i => i.id === active.id);
			const newIndex = items.findIndex(i => i.id === over.id);
			return arrayMove(items, oldIndex, newIndex);
		});
	};

	const pointsSubmit = () => {
		pnts.forEach((point, index) => {
			if (index !== points.findIndex(p => p.id === point.id)) {

			}
			axios.patch(`http://localhost:8081/points?id=${point.id}`, {
				position: index,
				expedition_id: expedition.id
			}, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				}
			});
		})
		// onHide()
	}

	return (
		// <Modal
		// 	onHide={onHide}
		// 	show={show}
		// 	className="justify-content-center fs-5 p-3"
		// 	style={{
		// 		backgroundColor: "rgba(45,45,45,0.6)",
		// 		boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
		// 		color: "honeydew",
		// 		zIndex: '2000',
		// 	}}
		// 	centered
		// 	contentClassName="bg-dark text-light"
		// 	dialogStyle={{
		// 		maxHeight: "90vh",
		// 		margin: 0,
		// 	}}
		// >
			<div
				style={{
					overflowY: 'auto',
					maxHeight: "70vh",
					padding: '20px',
				}}
			>
				<div style={{minHeight: "100%"}}>
					<DndContext
						collisionDetection={closestCenter}
						onDragEnd={handleDragEnd}
					>
						<SortableContext
							items={pnts.map(p => p.id)}
							strategy={verticalListSortingStrategy}
						>
							{pnts.map((point, index) => (
								<SortablePointItem
									key={point.id}
									point={point}
									index={index}
								/>
							))}
						</SortableContext>
					</DndContext>

					<div className='d-flex justify-content-center mt-4'>
						<BootstrapButton
							type='submit'
							className='submit-btn mx-3'
							onClick={() => pointsSubmit()}
						>
							Подтвердить
						</BootstrapButton>
					</div>
				</div>
			</div>
		// </Modal>
	);
};

interface DeleteProps {
	expeditionId: number
	show: boolean,
	onHide: () => void
}

const DeleteModal: React.FC<DeleteProps> = ({expeditionId, show, onHide}) => {
	const deleteExpedition = async () => {
		try {
			await axios.delete<Expedition>(`http://localhost:8081/expeditions?id=${expeditionId}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("authToken")}`
				}
			});
			onHide();
		} catch (err) {
			console.log(err)
		}
	}
	return (
		<Modal onHide={onHide} show={show}
				className="justify-content-center fs-5 p-3"
				style={{
					backgroundColor: "rgba(45,45,45,0.6)",
					boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
					color: "honeydew",
					zIndex: '2000',
				}}
				centered
				contentClassName="bg-dark text-light"
				dialogStyle={{
					maxHeight: "90vh",
					margin: 0,
				}}
			   size='sm'
		>
			<Modal.Title className='text-center'
						 style={{font:'Rubik', padding: '0.5rem 0'}}
			>
				<a>
					Удалить экспедицию?
				</a>
			</Modal.Title>
			<Modal.Body
				style={{padding: '1.5rem 0'}}
			>
				<Container className='d-flex p-0'
						   style={{justifyContent: 'center', width: '100%', alignItems: 'center'}}>
					<BootstrapButton
						type='submit'
						className='submit-btn justify-content-center mx-3 fs-5'
						onClick={()=>onHide()}
					>
						Отмена
					</BootstrapButton>
					<BootstrapButton
						variant='danger'
						className=' justify-content-center mx-3 fs-5'
						style={{background: '#C14545'}}
						onClick={()=> {
							deleteExpedition()
						}}
					>
						Удалить
					</BootstrapButton>
				</Container>
			</Modal.Body>
		</Modal>
	);
}


export default UpdExp

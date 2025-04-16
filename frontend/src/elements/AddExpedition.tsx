import {Container, Modal, ModalBody, ModalHeader, Button as BootstrapButton } from "react-bootstrap";
import React, {useEffect, useState} from "react";
import { Form, Input, DatePicker } from "antd";
import FormItem from "antd/es/form/FormItem";
import {Controller, useForm} from "react-hook-form";
import {YMaps, Map, Placemark} from '@pbe/react-yandex-maps';
import axios from "axios";
import {Expedition, Point} from "../../types.ts";
import { debounce } from "lodash";
import {GetPopupContainer} from "antd/es/table/interface";

interface ExpeditionData {
    name: string,
    description: string,
    starts_at: string,
    ends_at: string,
    points: Point[],
}

interface ExpDTO {
    name: string,
    description: string,
    dates: Date[],
    points: Point[],
}

interface Props {
    show: boolean
    onHide: ()=>void;
}

const { RangePicker } = DatePicker;

const createExpedition = async (Expedition: ExpeditionData) => {
    await axios.post<Expedition>("http://localhost:8081/expeditions",
        Expedition, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            }
        })
}


const AddExpedition: React.FC<Props> = (({show, onHide}) => {
    const {control, handleSubmit, formState: { errors }, reset} = useForm({
        defaultValues: {
            name: '',
            description: '',
            dates: [],
            points: [],
        }
    });

    const [markers, setMarkers] = useState<[number, number][]>([]);

    const [points, setPoints] = useState<any[]>([])

    interface PropsModal {
        show: boolean
    }

    const AddPointModal: React.FC<PropsModal> = (({show}) => {
        const [form] = Form.useForm();

        const validateName = debounce(() => {
            if (show) {
                form.validateFields(["point"]);
            }
        }, 200);

        useEffect(validateName,[])

        const handleAddPoint = () => {
            form.validateFields(['name'])
                .then(() => {
                    const nameValue = form.getFieldValue('point');
                    setShow(false);
                    addPoint(markers[markers.length - 1], nameValue);
                })
                .catch(() => {
                });
        };

        return (
            <Modal show={show} centered style={{fontFamily:'Rubik', zIndex:'10000'}} contentClassName='bg-dark text-light' size='sm'>
                <ModalHeader>
                    <div className="d-flex container">
                        <div className="d-flex col justify-content-center">
                            <Modal.Title>
                                <p className="my-0">
                                    Добавим точку?
                                </p>
                            </Modal.Title>
                        </div>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <Form
                        form={form}
                        onFinish={() => {handleAddPoint()}}
                    >
                        <Form.Item
                            name="point"
                            label={<span style={{fontFamily:'Rubik', color:'whitesmoke'}}>Название</span>}
                            rules={[
                                {
                                    required: true,
                                    whitespace: true,
                                    message: 'Название обязательно для заполнения!'
                                }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Container className='d-flex w-100 justify-content-center'>
                            <BootstrapButton
                                variant="danger"
                                className="mx-4"
                                style={{background:'#C14545'}}
                                onClick={() => {
                                    setShow(false);
                                    setMarkers(prev => prev.slice(0, -1));
                                }}
                            >
                                Удалить
                            </BootstrapButton>
                            <BootstrapButton
                                type="submit"
                                className='submit-btn mx-4'
                                onClick={() => {
                                    handleAddPoint()
                                    }
                                }
                            >
                                Добавить
                            </BootstrapButton>
                        </Container>
                    </Form>
                </ModalBody>
            </Modal>
        )
    })

    const [showAddPoint, setShow] = useState(false)

    const handleMapClick = (e: any) => {
        const coords: [number, number] = e.get('coords');
        setMarkers([...markers, coords]);
        setShow(true)
    };

    const addPoint = (coord: [number, number], name: string) => {
        const point = {
            id: undefined,
            name: name,
            location: coord[0].toFixed(4) + ',' + coord[1].toFixed(4),
        }
        setPoints([...points, point])
    }

    const onSubmit = async (data: ExpDTO) => {
        console.log(data)
        try {
            const expeditionData: ExpeditionData = {
                name: data.name,
                description: data.description,
                starts_at: data.dates[0].toISOString(),
                ends_at: data.dates[1].toISOString(),
                points: points,
            };
            await createExpedition(expeditionData);
            reset();
            setMarkers([]);
            setPoints([]);
            onHide();
        } catch (error) {
            console.error('Ошибка создания экспедиции:', error);
        }
    };

    const getPopupContainer: GetPopupContainer = (triggerNode) =>
        triggerNode.parentElement || document.body;

    return (
        <div>
            <AddPointModal show={showAddPoint}/>
            <Modal show={show} onHide={onHide} centered style={{fontFamily:'Rubik', zIndex:'2000'}} contentClassName='bg-dark text-light' size='lg'>
                <Modal.Header closeButton className="p-3">
                    <div className="d-flex container">
                        <div className="d-flex col justify-content-center">
                            <Modal.Title>
                                <p className="my-0">Данные экспедиции</p>
                            </Modal.Title>
                        </div>
                    </div>
                </Modal.Header>
                <ModalBody className='p-3'>
                    <Form
                        layout={"horizontal"}
                        style={{
                            fontFamily:'Rubik',
                        }}
                        labelCol={{span:3}}
                        wrapperCol={{span:18}}
                    >
                        <FormItem
                            label={<span style={{fontFamily:'Rubik', color:'whitesmoke'}}>Название</span>}
                            validateStatus={errors.name ? 'error' : ''}
                            help={errors.name?.message}
                            style={{justifySelf:'center', width:'100%'}}
                        >
                            <Controller
                                name='name'
                                control={control}
                                rules={{
                                    required: 'Обязательно!',
                                    pattern: {
                                        value: /^[A-Za-zА-Яа-яЁё\s]+$/,
                                        message: 'Только букы и пробелы!'
                                    }

                                }}
                                render={({field})=>(
                                    <Input
                                        {...field}
                                        status={errors.name ? 'error' : ''}
                                    />
                                )}
                            >
                            </Controller>
                        </FormItem>

                        <FormItem
                            label={<span style={{fontFamily:'Rubik', color:'whitesmoke'}}>Описание</span>}
                            validateStatus={errors.description ? 'error' : ''}
                            help={errors.description?.message}
                            style={{justifySelf:'center', width:'100%'}}
                        >
                            <Controller
                                name='description'
                                control={control}
                                rules={{
                                    required: 'Обязательно!',
                                }}
                                render={({field})=>(
                                    <Input.TextArea
                                        {...field}
                                        status={errors.description ? 'error' : ''}
                                        autoSize={{minRows:2, maxRows:10}}
                                    />
                                )}
                            >

                            </Controller>
                        </FormItem>

                        <FormItem
                            label={<span style={{fontFamily:'Rubik', color:'whitesmoke'}}>Даты</span>}
                            validateStatus={errors.dates ? 'error' : ''}
                            help={errors.dates?.message}
                        >
                            <Controller
                                name='dates'
                                control={control}
                                rules={{
                                    required: 'Обязательно!',
                                }}
                                render={({field})=>(
                                    <RangePicker
                                        {...field}
                                        status={errors.dates ? 'error' : ''}
                                        picker="date"
                                        popupStyle={{width:'100vw'}}
                                        getPopupContainer={getPopupContainer}
                                    />
                                )}

                            />
                        </FormItem>

                        <FormItem
                            label={<span style={{fontFamily:'Rubik', color:'whitesmoke'}}>Точки</span>}
                        >
                            <Controller
                                name='points'
                                control={control}
                                render={({}) => (
                                    <div>
                                        <YMaps
                                            query={{
                                                load: "package.full",
                                                apikey: "6896548d-124b-46a2-866d-67213d6c0a46"
                                            }}
                                        >
                                            <Map
                                                defaultState={{center: [59.95, 30.37], zoom: 9}}
                                                style={{height: '400px'}}
                                                onClick={handleMapClick}
                                            >
                                                {markers.map((coords, index) => (
                                                    <Placemark
                                                        key={`marker-${index}`}
                                                        geometry={coords}
                                                        options={{
                                                            preset: 'islands#darkBlueCircleDotIcon',
                                                            draggable: false

                                                        }}
                                                        properties={{
                                                            hintContent: `${points[index]?.name}`,
                                                            balloonContent:
                                                                `<div>
                                                          Координаты: ${coords[0].toFixed(6)}, ${coords[1].toFixed(6)}
                                                      </div>`
                                                        }}
                                                    />
                                                ))}
                                            </Map>
                                        </YMaps>
                                    </div>
                                )}
                            />
                        </FormItem>
                    </Form>

                    <Container className='d-flex'
                               style={{justifyContent: 'center', width: '100%', alignItems: 'center'}}>
                        <BootstrapButton
                            type='submit'
                            className='submit-btn justify-content-center'
                            onClick={handleSubmit(onSubmit)}
                        >
                            Создать
                        </BootstrapButton>
                    </Container>

                </ModalBody>
            </Modal>
        </div>
    );
});

export default AddExpedition
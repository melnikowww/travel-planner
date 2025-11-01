import {Container, Modal, Button as BootstrapButton } from "react-bootstrap";
import React, {useEffect, useState} from "react";
import { Form, Input, DatePicker } from "antd";
import FormItem from "antd/es/form/FormItem";
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import {YMaps, Map, Placemark} from '@pbe/react-yandex-maps';
import axios from "axios";
import {Crew, Expedition, Message, MessageType, Point, Status, User} from "../../types.ts";
import { debounce } from "lodash";
import {GetPopupContainer} from "antd/es/table/interface";
import type { Dayjs } from 'dayjs';

interface ExpeditionData {
    name: string,
    description: string,
    starts_at: string | undefined,
    ends_at: string | undefined,
    points: Point[],
}

interface ExpDTO {
    name: string,
    description: string,
    dates: [Dayjs | undefined, Dayjs | undefined],
    points: Point[],
    // equip: Equipment[],
}

interface Props {
    show: boolean
    onHide: ()=>void;
}

const { RangePicker } = DatePicker;

const createExpedition = async (Expedition: ExpeditionData) => {
    return await axios.post<Expedition>("http://localhost:8081/expeditions",
        Expedition, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            }
        })
}


const AddExpedition: React.FC<Props> = (({show, onHide}) => {
    const {control, handleSubmit, formState: { errors }, reset} = useForm<ExpDTO>({
        defaultValues: {
            name: '',
            description: '',
            dates: [undefined, undefined],
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
                form.validateFields(['point']);
            }
        }, 200);

        useEffect(validateName,[])

        const handleAddPoint = () => {
            form.validateFields(['point'])
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
                <Modal.Header>
                    <div className="d-flex container">
                        <div className="d-flex col justify-content-center">
                            <Modal.Title>
                                <p className="my-0">
                                    Добавим точку?
                                </p>
                            </Modal.Title>
                        </div>
                    </div>
                </Modal.Header>
                <Modal.Body>
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
                </Modal.Body>
            </Modal>
        )
    })

    const [showAddPoint, setShow] = useState(false)

    const handleMapClick = (e: any) => {
        const coords: [number, number] = e.get('coords');
        setMarkers([...markers, coords]);
        setShow(true)
    };

    const addPoint = (loc: [number, number], name: string) => {
        const point = {
            id: undefined,
            name: name,
            location: loc[0].toFixed(4) + ',' + loc[1].toFixed(4),
        }
        setPoints([...points, point])
    }

    const onSubmit: SubmitHandler<ExpDTO> = async (data) => {
        try {
            const expeditionData: ExpeditionData = {
                name: data.name,
                description: data.description,
                starts_at: data.dates[0]?.toISOString(),
                ends_at: data.dates[1]?.toISOString(),
                points: points,
            };
            const response = await createExpedition(expeditionData);
            const user = await axios.get<User>('http://localhost:8081/users?id=' + localStorage.getItem("id"), {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                }
            })
            await axios.post<Crew>("http://localhost:8081/crews",
                {
                    car_id: user.data.cars[0].id,
                    expedition_id: response.data.id
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                    }
                })
            await axios.post<Message>("http://localhost:8081/message",
                {
                    type: MessageType.NewExpedition,
                    status: Status.Active,
                    description: expeditionData.description,
                    expeditionName: expeditionData.name,
                    producerName: user.data.name
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                    }
                })
            reset();
            setMarkers([]);
            setPoints([]);
            onHide();
        } catch (error) {
            console.error('Ошибка создания экспедиции:', error);
        }
    };

    const getPopupContainer: GetPopupContainer = (triggerNode) => triggerNode.parentElement || document.body;

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
                <Modal.Body className='p-3 body-scroll'>
                        <Form
                            layout={"horizontal"}
                            style={{
                                fontFamily:'Rubik',
                                overflowX: 'hidden'
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
                                            message: 'Только буквы и пробелы!'
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
                                    render={({ field: { value, onChange, ...restField } }) => (
                                        <RangePicker
                                            value={[value[0], value[1]]}
                                            onChange={onChange}
                                            {...restField}
                                            status={errors.dates ? 'error' : ''}
                                            picker="date"
                                            popupStyle={{width: '100vw'}}
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
                                        <div className='rounded-4' style={{
                                            backgroundColor: "rgba(45,45,45,0.8)",
                                            border: "2px solid #DAA520",
                                            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                                            color: 'honeydew',
                                            overflow:'hidden',
                                        }}>
                                            <YMaps
                                                query={{
                                                    load: "package.full",
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
                </Modal.Body>
                <Modal.Footer>
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
                </Modal.Footer>
            </Modal>
        </div>
    );
});

export default AddExpedition
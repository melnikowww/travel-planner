import {Modal, ModalBody} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {Form, Input, DatePicker} from "antd";
import FormItem from "antd/es/form/FormItem";
import {Controller, useForm} from "react-hook-form";
import {YMaps, Map, Placemark} from '@pbe/react-yandex-maps';

interface Expedition {
    name: string,
    description: string,
    driverId: number,
    startsAt: string,
    endsAt: string,
    points: [],
}

interface Props {
    show: boolean,
    onHide: ()=>void
}

const AddExpeditionMobile: React.FC<Props> = ({show, onHide}) => {
    const { control, handleSubmit, formState: { errors }, reset, watch, trigger} = useForm({
        defaultValues: {
            name: '',
            description: '',
            creatorId: null,
            start: '',
            end: '',
            points: [],
        }
    });

    const endDateValidation = {
        required: 'Обязательно!',
        validate: (value: string) => {
            const startDate = watch('start');
            if (!startDate || !value) return true;
            return new Date(value) > new Date(startDate) || 'Дата окончания должна быть позже даты начала';
        }
    };


    const [markers, setMarkers] = useState<[number, number][]>([]);
    const [_, setCurrentCoords] = useState<[number, number] | null>(null);

    const handleMapClick = (e: any) => {
        const coords: [number, number] = e.get('coords');
        setMarkers([...markers, coords]);
        setCurrentCoords(coords);
    };


    return (
        <Modal show={show} centered style={{fontFamily:'Rubik'}} contentClassName='bg-dark text-light' size='lg'>
            <Modal.Header closeButton className="p-3">
                <div className="d-flex container">
                    <div className="d-flex col justify-content-center">
                        <Modal.Title>
                            <p className="my-0">Данные экспедиции!</p>
                        </Modal.Title>
                    </div>
                </div>
            </Modal.Header>
            <ModalBody className='p-3'>
                <Form
                    layout={"horizontal"}
                    style={{
                        // maxWidth:'700px',
                        fontFamily:'Rubik',
                    }}
                    labelCol={{span:3}}
                    wrapperCol={{span:18}}
                >
                    <FormItem
                        label={<span style={{fontFamily:'Rubik', color:'whitesmoke'}}>Название</span>}
                        validateStatus={errors.name ? 'error' : ''}
                        style={{justifySelf:'center', width:'100%'}}
                    >
                        <Controller
                            name='name'
                            control={control}
                            rules={{
                                required: 'Обязательно!',
                                pattern: /^[A-Za-zА-Яа-яЁё]+$/,
                            }}
                            render={({field})=>(
                                <Input
                                    {...field}
                                />
                            )}
                        >

                        </Controller>
                    </FormItem>

                    <FormItem
                        label={<span style={{fontFamily:'Rubik', color:'whitesmoke'}}>Описание</span>}
                        validateStatus={errors.name ? 'error' : ''}
                        style={{justifySelf:'center', width:'100%'}}
                    >
                        <Controller
                            name='description'
                            control={control}
                            rules={{
                                required: 'Обязательно!',
                                pattern: /^[A-Za-zА-Яа-яЁё]+$/,
                            }}
                            render={({field})=>(
                                <Input.TextArea
                                    {...field}
                                    autoSize={{minRows:2, maxRows:10}}
                                />
                            )}
                        >
                        </Controller>
                    </FormItem>

                    <FormItem
                        label={<span style={{fontFamily:'Rubik', color:'whitesmoke'}}>Даты</span>}
                        validateStatus={errors.name ? 'error' : ''}
                    >
                        <Controller
                            name='start'
                            control={control}
                            rules={{
                                required: 'Обязательно!',
                            }}
                            render={({field})=>(
                                <DatePicker
                                    picker="date"
                                    popupStyle={{width:'100vw'}}
                                    placeholder='Старт'
                                    {...field}
                                    getPopupContainer={(triggerNode)=>triggerNode.parentElement}
                                />
                            )}
                        />
                        <Controller
                            name='end'
                            control={control}
                            rules={endDateValidation    }
                            render={({field})=>(
                                <DatePicker
                                    picker="date"
                                    popupStyle={{width:'90vw'}}
                                    placeholder='Финиш'
                                    {...field}
                                    getPopupContainer={(triggerNode)=>triggerNode.parentElement}
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
                            render={({field}) => (
                                <YMaps
                                    {...field}
                                    query={{
                                        load: "package.full",
                                    }}
                                >
                                    <Map
                                        defaultState={{ center: [59.95, 30.37], zoom: 9 }}
                                        style={{height:'400px'}}
                                        onClick={handleMapClick}
                                    >
                                        {markers.map((coords, index) => (
                                            <Placemark
                                                key={`marker-${index}`}
                                                geometry={coords}
                                                options={{
                                                    preset: 'islands#darkBlueCircleDotIcon',
                                                    draggable: true

                                                }}
                                                properties={{
                                                    // hintContent: `Маркер ${index + 1}`,
                                                    balloonContent:
                                                        `<div>
                                                          Координаты: ${coords[0].toFixed(6)}, ${coords[1].toFixed(6)}
                                                          <Button>
                                                              Добавить!
                                                          </Button>
                                                      </div>`
                                                }}
                                            />
                                        ))}
                                    </Map>
                                </YMaps>
                            )}
                        />
                    </FormItem>
                </Form>
            </ModalBody>
        </Modal>
    );
}

export default AddExpeditionMobile
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
  CTimePicker,
  CDatePicker,
  CFormTextarea,
  CFormSelect,
  CCardHeader,
  CSpinner,
  CCardText,
  CCardTitle,
  CAlert,
  CListGroup,
  CListGroupItem,
} from '@coreui/react-pro'

import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import OrderApi from './order.api'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useTypedSelector } from '../../store'
import Modal from '../../components/Modal'
import DocumentsApi from '../documents/Documents.Api'
import AuthApi from '../auth/auth.api'
import Card from '../../components/Card'

import { getImagePlaceholderFromMime, phoneNumber } from '../../utils'
import setTime, { setTimeV2 } from '../../helper/timeFormat'
import api from '../../api'
import { monthToWord } from '../../helper/timeFormat'
import ProtocolApi, { DocEnum } from '../protocol-reports/ProtocolReports.Api'
import { OrderStatus } from '../../typings'
import SecondCard from '../../components/SecondCard'
import ThirdCard from '../../components/ThirdCard'
import ActComponent from '../../components/ActComponent'

const OrderDetail = (): JSX.Element => {
  const params = useParams()
  const [data, setData] = useState<any>({})
  const [users, setUsers] = useState<any>()
  const documentOrderIds: any = []
  const [showDate, setShowDate] = useState<any>('')
  const [dataComment, setDataComment] = useState<any>({
    comment: '',
    date: '',
    order: 0,
    users_permissions_user: 0,
  })

  const [loading, setLoading] = useState(true)
  const [dataModal, setDataModal] = useState<any>({
    name: '',
    verificationDate: '',
  })

  const [response, setResponse] =
    useState<{ type: 'success' | 'danger'; message: string }>()
  const [docNumbers, setDocNumbers] = useState<any>([])
  const [docNumbersPreview, setDocNumbersPreview] = useState<any>([])
  const [showPreviewPicture, setShowPreviewPicture] = useState('')
  const [visible, setVisible] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isDisabled, setIsDisabled] = useState(false)
  const dataUser = useTypedSelector((state) => state.dataUser)
  const isLabUser = useTypedSelector((state) => state.isLabRole)
  const isCompanyAdmin = useTypedSelector(
    (state) => state.dataUser.role == 'companyadmin',
  )
  const [searchParams] = useSearchParams()
  /* const [dataUsers, setDataUsers] = useState<any[]>([]) */
  const companyGlobalState = useTypedSelector((state) => state.company)
  const [modaVisible, setModalVisible] = useState(false)
  const [modal, setModal] = useState<boolean>(false)
  const [formUpload, setFormUpload] = useState<{
    name?: string
    file?: File | null
  }>({})
  const [isNewObject, setIsNewObject] = useState(false)
  const [objectsList, setObjectsList] = useState<any>([])
  const [filteredObjects, setFilteredObjects] = useState<any>({})
  const [employeesList, setEmployeesList] = useState<any>([])
  const [filteredEmployeesList, setFilteredEmployeesList] = useState<any>([])
  const [employeeName, setEmployeeName] = useState('')
  const [labInfo, setLabInfo] = useState<any>({})
  const [closeOrderModal, setCloseOrderModal] = useState(false)
  const [reasonError, setReasonError] = useState(false)
  const [protocolModalVisible, setProtocolModalVisible] = useState(false)
  const [method, setMethod] = useState<null | string>(null)

  const objects = useRef<any>(null)
  const objectsInput = useRef<any>(null)
  const employees = useRef<any>(null)
  const employeesInput = useRef<any>(null)

  const emptyCommentator = {
    name: '',
    surname: '',
    lastName: '',
  }

  const firstSectionRef = useRef<any>()
  const commentRef = useRef<any>()
  const documentRef = useRef<any>()

  const getDateV1 = (date: any, time?: boolean) => {
    const dateObj = new Date(date)
    const month = dateObj.getUTCMonth() + 1 //months from 1-12
    const day = dateObj.getUTCDate()
    const year = dateObj.getUTCFullYear()
    if (time) {
      const hour = date.split(':')[0]
      const minute = date.split(':')[1]

      return `${hour}:${minute}`
    }
    return day + ' ' + monthToWord(month) + ' ' + year
  }

  const getDateV2 = (date: any, time?: boolean) => {
    const dateObj = new Date(date)
    const day = dateObj.getUTCDate()
    const year = dateObj.getUTCFullYear()
    if (time) {
      const hour = date.split(':')[0]
      const minute = date.split(':')[1]

      return `${hour}:${minute}`
    }

    const month = dateObj.toLocaleDateString(undefined, {
      month: 'short',
    })

    return day + ' ' + month + ' ' + year
  }

  const [actDetail, setActDetail] = useState<any>({
    samplingDate: '',
    samplingTime: '',
    respCompUserId: null,
    materialName: '',
    user: '',
    note: '',
    samplingQuantity: '',
    qualityDocument: '',
    id: null,
    environmental: '',
  })
  const [haveAct, setHaveAct] = useState(false)
  const isView = searchParams.get('view') === 'true'

  const isCompany = dataUser?.role?.includes('company')

  const [alertGoToAddObject, setAlertGoToAddObject] = useState<any>(null)

  const [buttonStyle, setButtonStyle] = useState<any>({
    width: '180px',
    marginTop: '20px',
    backgroundColor: '#F1F4F7',
    color: '#414141',
    marginBottom: '20px',
  })

  const getData = useCallback(
    async (abortController: AbortController, id: string) => {
      setLoading(true)
      OrderApi.getOrderById(+id, abortController).then(
        async (response: any) => {
          // redirect if lab user try to edit order
          if (
            (isLabUser && !isView && !response.data.isSelf) ||
            response.data.status == OrderStatus.DONE
          ) {
            navigate(`/orders/${params.id}?view=true`, { replace: true })
          }

          setData((data: any) => ({ ...data, ...response.data }))

          const samplingAct = response.data.samplingAct

          if (samplingAct) {
            setActDetail({ ...samplingAct })
          }
          setLoading(false)
        },
      )
    },
    [],
  )
  useEffect(() => {
    const abortController = new AbortController()
    if (Number.isNaN(Number.parseInt(params?.id || ''))) {
      navigate(`/orders`, {
        replace: true,
      })
    }

    if (params.id) {
      dispatch({ type: 'set', order: `${params.id}` })
      getData(abortController, params.id)
    }
    return () => {
      abortController.abort()
    }
  }, [params.id, getData])

  useEffect(() => {
    const abortController = new AbortController()

    return () => {
      abortController.abort()
    }
  }, [companyGlobalState.id])

  const abortControllerGlobal = useMemo(() => new AbortController(), [])

  useEffect(() => {
    return () => {
      abortControllerGlobal.abort()
    }
  }, [])

  function sendButtonStyle(value: string | null) {
    if (value) {
      setButtonStyle({
        ...buttonStyle,
        backgroundColor: '#747DEA',
        color: '#fff',
      })
    } else {
      setButtonStyle({
        ...buttonStyle,
        backgroundColor: '#F1F4F7',
        color: '#414141',
      })
    }
  }

  const handleChange = (name: string, e: any) => {
    setData({ ...data, [name]: e.target?.value ?? e })
  }

  const handleChangeActDetail = (key: any, e: any) => {
    setActDetail({ ...actDetail, [key]: e.target?.value ?? e })
  }

  const filterObjects = (value: string) => {
    console.log(objectsList, filteredObjects)
    const filtered = objectsList?.filter(
      (i: any) => i.name.toLowerCase().indexOf(value.toLowerCase()) > -1,
    )
    console.log(filtered)
    setFilteredObjects(filtered)
  }

  const compareObjects = (value: string) => {
    return objectsList.some((item: any) => item.name == value)
  }

  const handleSubmit = () => {
    if (!data) return
    let dateProcess = null
    if (data.date_process) {
      dateProcess = new Date(data.date_process)
      setShowDate(dateProcess?.toISOString())
      dateProcess.setDate(dateProcess.getDate() + 1)
    }

    let testDate = null
    if (data.testDate) {
      testDate = new Date(data.testDate)
      setShowDate(testDate?.toISOString())
      testDate.setDate(testDate.getDate() + 1)
    }

    const sendData = {
      ...data,
    }

    sendData.researchObjects.companyId = companyGlobalState.id
    console.log(data, sendData)
  }

  const user = data?.user
  const userResponsible = data?.responsibleUser
  const actNumber = data?.id

  function DateShow({ date, onDateChange }: any) {
    return (
      <CDatePicker
        placeholder={'Выберите дату'}
        style={{
          width: '60%',
        }}
        locale="ru-RU"
        onDateChange={(e: any) => {
          onDateChange(e)
        }}
        date={date}
        weekdayFormat={1}
      />
    )
  }

  console.log(data, '<<<<<======= INI ADALAH DATA')

  const contentModal = (
    <>
      <div
        style={{
          marginTop: '2%',
        }}
      >
        <CFormInput
          type="text"
          placeholder={'Введите название документа' as any}
          value={formUpload.name}
          onChange={(e: any) => {
            setFormUpload((prev) => ({
              ...prev,
              name: e.target.value,
            }))
          }}
        />
      </div>
      <div
        style={{
          marginTop: '1.5rem',
        }}
      >
        <CFormInput
          onChange={(e: any) =>
            setFormUpload((prev) => ({
              ...prev,
              name: e.target?.files[0]?.name?.split('.').slice(0, -1).join('.'),
              file: e.target?.files?.item(0),
            }))
          }
          type="file"
        />
      </div>
    </>
  )

  const uploadDocuments = () => {
    if (formUpload.file) {
      setLoading(true)
      const abortController = new AbortController()
      DocumentsApi.create(
        {
          orderId: +params.id!,
          name: formUpload.name ?? 'Документ',
        },
        formUpload.file,
      )
        .then((res: any) => {
          dispatch({
            type: 'toast',
            toast: {
              message: 'Сопроводительный документ успешно добавлен',
              status: res.status,
            },
          })
          getData(abortController, params.id!)
          setFormUpload({})
        })
        .catch((res) => {
          dispatch({
            type: 'toast',
            toast: {
              message: 'Произошла ошибка загрузки документа, попробуйте позже',
              status: res.status,
            },
          })
        })
        .finally(() => setLoading(false))
    }
  }

  return loading ? (
    <div className="loading_spinner">
      <CSpinner />
    </div>
  ) : (
    <>
      <div
        style={{ maxWidth: visible ? '700px' : '' }}
        onClick={(e: any) => {
          if (e.target !== objectsInput.current && !isView) {
            objects.current.style.display = 'none'
          }
          if (
            e.target !== employees.current &&
            e.target !== employeesInput.current &&
            !isView &&
            employees.current
          ) {
            employees.current.style.display = 'none'
          }
        }}
      >
        <CRow>
          <ActComponent
            data={data}
            getDateV1={getDateV1}
            firstSectionRef={firstSectionRef}
            user={user}
            userResponsible={userResponsible}
            phoneNumber={phoneNumber}
            labInfo={labInfo}
            isView={isView}
            setData={setData}
            handleChange={handleChange}
            objectsInput={objectsInput}
            filterObjects={filterObjects}
            setIsNewObject={setIsNewObject}
            compareObjects={compareObjects}
            objects={objects}
            actNumber={actNumber}
            actDetail={actDetail}
            filteredObjects={filteredObjects}
          />

          {/* THIRD CARD */}
          {actDetail.id || !isView ? (
            <ThirdCard
              documentRef={documentRef}
              actDetail={actDetail}
              isView={isView}
              data={data}
              getDateV1={getDateV1}
              handleChangeActDetail={handleChangeActDetail}
              employeesInput={employeesInput}
            />
          ) : (
            <></>
          )}
          {/* FOURTH CARD */}
          <CCard className={`mt-4 px-0 firstContentToPrint`}>
            <CCardHeader>
              <div>Сопроводительные документы к заявке</div>
            </CCardHeader>
            <CCardBody
              style={{
                padding: '4rem 4rem',
              }}
            >
              <CCol>
                <CForm>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      marginBottom: '20px',
                    }}
                  >
                    {data.documents?.map((el: any, i: number) => {
                      return (
                        <div
                          style={{
                            flex: '0 0 33.33%',
                            display: 'flex',
                            padding: '1rem',
                            cursor: el.file ? 'pointer' : 'not-allowed',
                          }}
                          key={i}
                          className="mt-2"
                          onClick={() => {
                            const file = el.file?.url
                            if (
                              file &&
                              (file?.includes('.pdf') ||
                                file?.includes('.jpg') ||
                                file?.includes('.jpeg') ||
                                file?.includes('.bmp') ||
                                file?.includes('.png'))
                            ) {
                              navigate(
                                `/orders/document/${el.id}/${data.id}?name=${el.name}`,
                              )
                            }
                          }}
                        >
                          <div
                            style={{
                              flex: '0 0 100%',
                            }}
                          >
                            <CCard
                              style={{
                                width: '288px',
                                height: '100%',
                              }}
                            >
                              <img
                                style={{ height: '150px' }}
                                alt={el.name}
                                src={
                                  getImagePlaceholderFromMime(el.file?.url) ??
                                  null
                                }
                              />
                              <CCardBody>
                                <CCardTitle>{el.name}</CCardTitle>
                                {el.createdAt ? (
                                  <CCardText>{setTime(el.createdAt)}</CCardText>
                                ) : (
                                  <></>
                                )}
                              </CCardBody>
                            </CCard>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CForm>
              </CCol>
            </CCardBody>
          </CCard>
          {/* SECOND CARD */}
          <SecondCard
            data={data}
            commentRef={commentRef}
            isView={isView}
            emptyCommentator={emptyCommentator}
            setTimeV2={setTimeV2}
            setDataComment={setDataComment}
            sendButtonStyle={sendButtonStyle}
            params={params}
            dataUser={dataUser}
          />
          {/* PROTOCOL CARD */}
          {data?.protocols?.length ? (
            <CCard className="mt-4 px-0">
              <CCardHeader>
                <div>Зарегистрированные протоколы заявки</div>
              </CCardHeader>
              <CCardBody
                style={{
                  padding: '4rem 4rem',
                }}
              >
                <CCol>
                  <CForm>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        marginBottom: '20px',
                      }}
                    >
                      {data?.protocols
                        ?.filter((i: any) => i.registered)
                        .map((el: any, i: number) => {
                          return (
                            <div
                              key={i}
                              style={{
                                flex: '0 0 33.33%',
                                display: 'flex',
                                padding: '1rem',
                                cursor:
                                  el.file || el.isCustom
                                    ? 'pointer'
                                    : 'not-allowed',
                              }}
                              className="mt-2 card-protocol"
                              onClick={() => {
                                const file = el.file?.url
                                console.log(el)
                                if (
                                  file &&
                                  (file?.includes('.pdf') ||
                                    file?.includes('.jpg') ||
                                    file?.includes('.jpeg') ||
                                    file?.includes('.bmp') ||
                                    file?.includes('.png'))
                                ) {
                                  navigate(
                                    `/protocol/${data?.id}/${el.id}?name=${el.name}`,
                                  )
                                } else if (el.isCustom) {
                                  navigate(
                                    `/orders/${params.id}/custom-protocol/${el.id}?view=true?name=${el.number}`,
                                  )
                                }
                              }}
                            >
                              <div
                                style={{
                                  flex: '0 0 100%',
                                }}
                              >
                                <CCard
                                  style={{
                                    width: '288px',
                                    height: '100%',
                                  }}
                                >
                                  <img
                                    style={{ height: '150px' }}
                                    alt={el?.name}
                                    src={getImagePlaceholderFromMime(
                                      el?.file?.url,
                                    )}
                                  />
                                  <CCardBody>
                                    <CCardTitle>
                                      {el.isCustom
                                        ? `Протокол ${
                                            el.number ? `№ ${el.number}` : ''
                                          }`
                                        : el?.name}
                                    </CCardTitle>
                                    {el.createdAt ? (
                                      <CCardText>
                                        {setTime(el.createdAt)}
                                      </CCardText>
                                    ) : (
                                      <></>
                                    )}
                                  </CCardBody>
                                </CCard>
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  </CForm>
                </CCol>
              </CCardBody>
            </CCard>
          ) : (
            <></>
          )}
          {data.protocols.find((protocol: any) => !protocol.registered) ? (
            <CCard className="mt-4 px-0">
              <CCardHeader>
                <div>Незарегистрированные протоколы заявки</div>
              </CCardHeader>
              <CCardBody
                style={{
                  padding: '4rem 4rem',
                }}
              >
                <CCol>
                  <CForm>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        marginBottom: '20px',
                      }}
                    >
                      {data?.protocols
                        ?.filter((i: any) => !i.registered)
                        .map((el: any, i: number) => {
                          return (
                            <div
                              key={i}
                              style={{
                                flex: '0 0 33.33%',
                                display: 'flex',
                                padding: '1rem',
                                cursor:
                                  el.file || el.isCustom
                                    ? 'pointer'
                                    : 'not-allowed',
                              }}
                              className="mt-2 card-protocol"
                              onClick={() => {
                                const file = el.file?.url
                                console.log(el)
                                /* if (
                                  file &&
                                  (file?.includes('.pdf') ||
                                    file?.includes('.jpg') ||
                                    file?.includes('.jpeg') ||
                                    file?.includes('.bmp') ||
                                    file?.includes('.png'))
                                ) {
                                  navigate(
                                    `/protocol/${data?.id}/${el.id}?name=${el.name}`,
                                  )
                                } else  */
                                if (isLabUser) {
                                  if (el.isCustom) {
                                    navigate(
                                      `/orders/${params.id}/custom-protocol/${el.id}`,
                                    )
                                  }
                                }
                              }}
                            >
                              <div
                                style={{
                                  flex: '0 0 100%',
                                }}
                              >
                                <CCard
                                  style={{
                                    width: '288px',
                                    height: '100%',
                                  }}
                                >
                                  <img
                                    style={{ height: '150px' }}
                                    alt={el?.name}
                                    src={getImagePlaceholderFromMime(
                                      el?.file?.url,
                                    )}
                                  />
                                  <CCardBody>
                                    <CCardTitle>Протокол</CCardTitle>
                                    {el.createdAt ? (
                                      <CCardText>
                                        {setTime(el.createdAt)}
                                      </CCardText>
                                    ) : (
                                      <></>
                                    )}
                                  </CCardBody>
                                </CCard>
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  </CForm>
                </CCol>
              </CCardBody>
            </CCard>
          ) : null}
          {/* В РАБОТУ */}
          {!isCompany &&
          (data?.status == OrderStatus.NEW ||
            data?.status == OrderStatus.WIP) ? (
            <div className="mt-4 p-0">
              <CAlert
                color="danger"
                dismissible
                visible={!!alertGoToAddObject}
                onClose={() => setAlertGoToAddObject(null)}
              >
                {alertGoToAddObject}
              </CAlert>
              <CCard className="px-0">
                <CCardHeader>
                  <div>
                    {!data?.responsibleUser
                      ? 'Добавить в работу'
                      : 'Добавить протокол'}
                  </div>
                </CCardHeader>
                <CCardBody
                  style={{
                    padding: '4rem 4rem',
                  }}
                >
                  <CCol>
                    <CForm>
                      {/* UPPER INFO BORDER */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          paddingTop: '2%',
                        }}
                      >
                        <CFormLabel
                          style={{
                            width: '40%',
                          }}
                        >
                          Ответственный:
                        </CFormLabel>
                        <CFormSelect
                          aria-label="Default select example"
                          style={{
                            width: '60%',
                          }}
                          value={data?.responsibleUserId}
                        >
                          {data.status == OrderStatus.NEW ? (
                            <option value="default">
                              Назначить ответственного
                            </option>
                          ) : null}
                          {employeesList.map((e: any, i: number) => {
                            return (
                              <option key={e.id} value={e.id}>
                                {e.surname} {e.name} {e.lastName}
                              </option>
                            )
                          })}
                        </CFormSelect>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          paddingTop: '2%',
                        }}
                      >
                        <CFormLabel
                          style={{
                            width: '40%',
                          }}
                        >
                          Дата проведения испытаний:
                        </CFormLabel>

                        <DateShow
                          date={data?.testDate}
                          onDateChange={(e: Date) => {
                            if (!e) {
                              setData({
                                ...data,
                                testDate: null,
                              })
                              return
                            }
                            const date = e.setMinutes(
                              e.getMinutes() - new Date().getTimezoneOffset(),
                            )
                          }}
                        />
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'end',
                        }}
                      ></div>
                    </CForm>
                  </CCol>
                </CCardBody>
              </CCard>
            </div>
          ) : (
            <></>
          )}
        </CRow>
      </div>
    </>
  )
}

export default OrderDetail

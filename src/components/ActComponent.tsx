import { useReactToPrint } from 'react-to-print'
import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import s from '../shared/styles/reports.module.css'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDatePicker,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CListGroup,
  CListGroupItem,
  CTimePicker,
} from '@coreui/react-pro'
import { downloadPDF } from '../shared/functions/globalFunc'

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

const ActComponent = (Props: any) => {
  const {
    data,
    getDateV1,
    firstSectionRef,
    user,
    userResponsible,
    phoneNumber,
    labInfo,
    isView,
    setData,
    handleChange,
    objectsInput,
    filterObjects,
    setIsNewObject,
    compareObjects,
    objects,
    actNumber,
    actDetail,
    filteredObjects,
  } = Props
  const componentRef = useRef<any>()
  const [loader, setLoader] = useState(false)

  const handlePrint = useReactToPrint({
    content: () => componentRef?.current,
    documentTitle: 'emp-data',
  })

  return (
    <CCard className="px-0 contentToPrint">
      <CCardHeader>
        <div>
          Заявка №{data?.id} от {getDateV1(data?.createdAt)}г.
        </div>
      </CCardHeader>
      <CCardBody
        ref={componentRef}
        style={{
          padding: '6rem 4rem',
        }}
      >
        <CCol
          ref={firstSectionRef}
          style={{
            wordBreak: 'break-word',
          }}
        >
          <CForm>
            {/* UPPER INFO BORDER */}
            <div
              className="avoid-break-inside"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <div
                style={{
                  flex: 2,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    paddingTop: '2px',
                  }}
                >
                  <CFormLabel
                    style={{
                      flex: 1,
                    }}
                  >
                    Контрагент:{' '}
                  </CFormLabel>
                  <CFormLabel
                    style={{
                      flex: 2,
                      color: 'black',
                      fontWeight: 'bold',
                    }}
                  >
                    {data?.user
                      ? `${data?.user?.company?.legalForm} «${data?.user?.company?.name}»`
                      : '-'}
                  </CFormLabel>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    paddingTop: '2px',
                  }}
                >
                  <CFormLabel
                    style={{
                      flex: 1,
                    }}
                  >
                    Заявку составил:{' '}
                  </CFormLabel>
                  <CFormLabel
                    style={{
                      flex: 2,
                      color: 'black',
                      fontWeight: 'bold',
                    }}
                  >
                    {user
                      ? `${user?.surname} ${user?.name[0]}.${
                          user.lastName ? `${user?.lastName[0]}.` : ''
                        }`
                      : ''}
                  </CFormLabel>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                  }}
                >
                  <CFormLabel
                    style={{
                      flex: 1,
                    }}
                  >
                    Телефон составителя:{' '}
                  </CFormLabel>
                  <CFormLabel
                    style={{
                      flex: 2,
                      color: 'black',
                      fontWeight: 'bold',
                    }}
                  >
                    {user.phone[0] == '8' ||
                    user.phone[0] == '+' ||
                    user.phone[0] == '2' ||
                    user.phone == ''
                      ? user.phone
                      : `+${user.phone}`}
                  </CFormLabel>
                </div>
                <div style={{ display: 'flex' }}>
                  <div
                    style={{
                      flex: 1,
                    }}
                  >
                    <p>Ответственный:</p>
                  </div>
                  <div
                    style={{
                      flex: 2,
                      color: 'black',
                      fontWeight: 'bold',
                    }}
                  >
                    <p>
                      {userResponsible?.name
                        ? `${userResponsible?.surname} ${userResponsible?.name[0]}.${userResponsible?.lastName[0]}.`
                        : 'Не заполнено'}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex' }}>
                  <div
                    style={{
                      // width: '200px',
                      flex: 1,
                    }}
                  >
                    <p>Телефон исполнителя:</p>
                  </div>
                  <div
                    style={{
                      flex: 2,
                      color: 'black',
                      fontWeight: 'bold',
                    }}
                  >
                    <p>
                      {
                        userResponsible?.phone
                          ? phoneNumber(userResponsible.phone)
                          : 'Не заполнено'
                        /* userResponsible?.phone?.indexOf('+') > -1 ||
                        userResponsible?.phone[0] == '8'
                          ? userResponsible?.phone
                          : `+${userResponsible?.phone}` */
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div
                style={{
                  fontSize: '16px',
                  color: 'black',
                  textAlign: 'end',
                  flex: 1,
                }}
              >
                <p>
                  Генеральному директору
                  <br />
                  {labInfo?.legalForm + ' ' + labInfo?.name}
                  <br />
                  {`${labInfo.owner?.surname} ${labInfo.owner?.name?.[0]}. ${labInfo.owner?.lastName?.[0]}.`}
                </p>
              </div>
            </div>
            {/* HERE IT SHOWS IF VIEW IS TRUE */}
            {isView ? (
              <>
                <div className="avoid-break-inside">
                  <div
                    style={{
                      margin: '0 auto',
                      width: '360px',
                      fontSize: '16px',
                      color: 'black',
                      textAlign: 'center',
                      fontWeight: 'bold',
                    }}
                  >
                    <p style={{}}>
                      Заявка № {data?.id} от {getDateV1(data?.createdAt)}
                      г.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}
            {/* UPPER INFO BORDER */}
            <div
              style={{
                paddingTop: '40px',
                paddingBottom: '40px',
              }}
            >
              <p>Прошу провести испытания по ниже указанным параметрам:</p>
            </div>
            <div
              className="avoid-break-inside"
              style={{
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              <CFormLabel
                style={{
                  width: '40%',
                }}
              >
                Дата проведения испытаний:{' '}
              </CFormLabel>
              {isView ? (
                <CFormLabel
                  style={{
                    width: '60%',
                  }}
                >
                  {data.testDate ? getDateV1(data?.testDate) : 'Не выбрано'}
                </CFormLabel>
              ) : (
                <DateShow
                  date={data?.testDate}
                  onDateChange={(e: any) => {
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
                    setData({
                      ...data,
                      testDate: date,
                    })
                  }}
                />
              )}
            </div>
            <div
              className="avoid-break-inside"
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
                Время проведения испытаний:{' '}
              </CFormLabel>
              {isView ? (
                <CFormLabel
                  style={{
                    width: '60%',
                  }}
                >
                  {data?.testTime ?? 'Не выбрано'}
                </CFormLabel>
              ) : (
                <CTimePicker
                  seconds={false}
                  placeholder="17:00"
                  style={{
                    width: '60%',
                  }}
                  locale="ru-RU"
                  time={data?.testTime}
                  onTimeChange={(e: any) => {
                    const getTime = e.split(/[ ,:]/g)

                    setData({
                      ...data,
                      testTime: `${getTime[0]}:${getTime[1]}`,
                    })
                  }}
                />
              )}
            </div>

            <div
              className="avoid-break-inside"
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
                Виды работ:
              </CFormLabel>
              {isView ? (
                <CFormLabel
                  style={{
                    width: '60%',
                  }}
                >
                  {data?.typeJob || 'Не выбрано'}
                </CFormLabel>
              ) : (
                <CFormInput
                  type="text"
                  placeholder={'введите виды работ' as any}
                  style={{
                    width: '60%',
                  }}
                  value={data?.typeJob}
                  onChange={(e: any) => {
                    handleChange('typeJob', e)
                  }}
                />
              )}
            </div>
            <div
              className="avoid-break-inside"
              style={{
                display: 'flex',
                flexDirection: 'row',
                paddingTop: '2%',
                position: 'relative',
              }}
            >
              <CFormLabel
                style={{
                  width: '40%',
                }}
              >
                Объект строительства:
              </CFormLabel>
              {isView ? (
                <CFormLabel
                  style={{
                    width: '60%',
                  }}
                >
                  {data?.researchObjects
                    ? data?.researchObjects?.name
                    : 'Не выбрано'}
                </CFormLabel>
              ) : (
                // <CFormInput
                //   type="text"
                //   placeholder={'введите объект строительства' as any}
                //   style={{
                //     width: '60%',
                //   }}
                //   value={data?.researchObjects.name}
                //   onChange={(e: any) => {
                //     // setDataAct({ ...dataAct, objectName: e.target.value })
                //     /* handleChange('object_name', e) */
                //     setData({
                //       ...data,
                //       researchObjects: {
                //         ...data.researchObjects,
                //         name: e.target.value,
                //       },
                //     })
                //   }}
                // />
                <>
                  <CFormInput
                    type="text"
                    placeholder={'введите объект строительства' as any}
                    style={{
                      width: '60%',
                    }}
                    ref={objectsInput}
                    value={data.researchObjects?.name}
                    onChange={(e: any) => {
                      /* setDataAct({ ...dataAct, objectName: e.target.value }) */
                      setData({
                        ...data,
                        researchObjects: {
                          name: e.target.value,
                        },
                      })
                      filterObjects(e.target.value)
                      objects.current.style.display = 'block'
                      setIsNewObject(!compareObjects(e.target.value))
                    }}
                    onFocus={() => {
                      objects.current.style.display = 'block'
                    }}
                  />
                  <div
                    ref={objects}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      width: '60%',
                      height: 300,
                      display: 'none',
                    }}
                  >
                    <CListGroup className="input-list">
                      {filteredObjects.length
                        ? filteredObjects.map((i: any, index: number) => (
                            <CListGroupItem
                              onClick={(e: any) => {
                                console.log(i)
                                /* setDataAct({
                                    ...dataAct,
                                    researchObjects.name: e.target.textContent,
                                  }) */
                                setData({
                                  ...data,
                                  researchObjects: {
                                    name: e.target.textContent,
                                  },
                                })
                                setIsNewObject(false)
                                objects.current.style.display = 'none'
                              }}
                              style={{
                                listStyleType: 'none',
                                cursor: 'pointer',
                              }}
                              key={index}
                              tabIndex={0}
                              onKeyDown={(e: any) => {
                                if (e.keyCode == 13) {
                                  setData({
                                    ...data,
                                    researchObjects: {
                                      name: e.target.textContent,
                                    },
                                  })
                                  objects.current.style.display = 'none'
                                  setIsNewObject(false)
                                }
                              }}
                            >
                              {i.name}
                            </CListGroupItem>
                          ))
                        : null}
                    </CListGroup>
                  </div>
                </>
              )}
            </div>
            <div
              className="avoid-break-inside"
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
                Объект контроля:
              </CFormLabel>
              {isView ? (
                <CFormLabel
                  style={{
                    width: '60%',
                  }}
                >
                  {data?.objectControl || 'Не выбрано'}
                </CFormLabel>
              ) : (
                <CFormInput
                  type="text"
                  placeholder={'введите объект контроля' as any}
                  style={{
                    width: '60%',
                  }}
                  value={data?.objectControl}
                  onChange={(e: any) => {
                    // setDataAct({
                    //   ...dataAct,
                    //   objectOfControl: e.target.value,
                    // })
                    handleChange('objectControl', e)
                  }}
                />
              )}
            </div>
            <div
              className="avoid-break-inside"
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
                Место отбора проб:
              </CFormLabel>
              {isView ? (
                <CFormLabel
                  style={{
                    width: '60%',
                  }}
                >
                  {data?.samplingLocation || 'Не выбрано'}
                </CFormLabel>
              ) : (
                <CFormInput
                  type="text"
                  placeholder={'введите место отбора проб' as any}
                  style={{
                    width: '60%',
                  }}
                  value={data?.samplingLocation}
                  onChange={(e: any) => {
                    // setDataAct({
                    //   ...dataAct,
                    //   samplingLocation: e.target.value,
                    // })
                    handleChange('samplingLocation', e)
                  }}
                />
              )}
            </div>
            <div
              className="avoid-break-inside"
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
                Проект:
              </CFormLabel>
              {isView ? (
                <CFormLabel
                  style={{
                    width: '60%',
                  }}
                >
                  {data?.name || 'Не выбрано'}
                </CFormLabel>
              ) : (
                <CFormInput
                  type="text"
                  placeholder={'введите наименование проекта' as any}
                  style={{
                    width: '60%',
                  }}
                  value={data?.name}
                  onChange={(e: any) => {
                    handleChange('name', e)
                  }}
                />
              )}
            </div>
            <div
              className="avoid-break-inside"
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
                Краткая информация:
              </CFormLabel>
              {isView ? (
                <CFormLabel
                  style={{
                    width: '60%',
                  }}
                >
                  {data?.description || 'Не выбрано'}
                </CFormLabel>
              ) : (
                <CFormTextarea
                  id="info"
                  rows={data?.description?.split('\n').length}
                  placeholder={
                    'Введите: Класс прочности бетона; Материал; Тип грунта; и т.д.' as any
                  }
                  style={{
                    width: '60%',
                  }}
                  value={data?.description}
                  onChange={(e: any) => {
                    handleChange('description', e)
                  }}
                />
              )}
            </div>
            <div
              {...(!actNumber ? { 'data-html2canvas-ignore': true } : {})}
              style={{
                /* display: 'flex', */
                justifyContent: 'space-between',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginTop: '10px',
                  width: '500px',
                }}
              >
                {actDetail.id ? (
                  <>
                    <CFormLabel
                      style={{
                        width: '200px',
                        color: 'black',
                        fontWeight: 'bold',
                      }}
                    >
                      Приложение:
                    </CFormLabel>
                    <CFormLabel
                      style={{
                        width: '300px',
                        color: 'black',
                        fontWeight: 'bold',
                      }}
                    >
                      Акт отбора проб № {actDetail?.id ?? '-'}
                    </CFormLabel>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div
              className="sign-section"
              style={{
                display: 'none',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  paddingTop: '6rem',
                }}
              >
                <div
                  className="auto-page-break-stop-recursive"
                  style={{
                    flex: 1,
                  }}
                >
                  <span>Фамилия</span>
                  <span>{'_'.repeat(20)}</span>
                </div>
                <div
                  className="auto-page-break-stop-recursive"
                  style={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'end',
                    flexDirection: 'row',
                  }}
                >
                  <span>Подпись</span>
                  <span>{'_'.repeat(20)}</span>
                </div>
              </div>
            </div>
          </CForm>
          <div className={s.footer}>
            <div className={s.subcontainer}>
              <p>ФИО: ____________</p>
              <p>Подпись: ________</p>
            </div>
          </div>
        </CCol>
      </CCardBody>
      <div
        style={{
          display: 'flex',
          gap: '12px',
          width: '100%',
          marginLeft: '10px',
          marginBottom: '10px',
        }}
      >
        <CButton onClick={handlePrint}>Печать</CButton>
        <CButton
          className="receipt-modal-download-button"
          onClick={() => {
            downloadPDF(componentRef)
          }}
          disabled={loader}
        >
          {loader ? <span>Процесс загрузки...</span> : <span>Cкачать</span>}
        </CButton>
      </div>
    </CCard>
  )
}
export default ActComponent

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
  CTimePicker,
} from '@coreui/react-pro'
import { useReactToPrint } from 'react-to-print'
import { useRef, useState } from 'react'
import { downloadPDF } from '../shared/functions/globalFunc'
import s from '../shared/styles/reports.module.css'
const ThirdCard = (Props: any) => {
  const {
    documentRef,
    actDetail,
    isView,
    data,
    getDateV1,
    handleChangeActDetail,
    employeesInput,
  } = Props
  const componentRef = useRef<any>()
  const [loader, setLoader] = useState(false)

  const handlePrint = useReactToPrint({
    content: () => componentRef?.current,
    documentTitle: 'emp-data',
  })

  return (
    <CCard className="mt-4 px-0 contentToPrint">
      <CCardHeader>
        <div>Акт отбора проб № {actDetail?.id}</div>
      </CCardHeader>
      <CCardBody
        ref={componentRef}
        style={{
          padding: '4rem 4rem',
        }}
      >
        <CCol
          ref={documentRef}
          style={{
            wordBreak: 'break-word',
          }}
        >
          <CForm
            onSubmit={(e) => {
              e.preventDefault()
            }}
            style={{
              wordBreak: 'break-word',
            }}
          >
            {/* UPPER INFO BORDER */}
            {isView ? (
              <div>
                <div
                  style={{
                    margin: '0 auto',
                    width: '200px',
                    fontSize: '16px',
                    color: 'black',
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }}
                >
                  <p>Акт отбора проб № {actDetail?.id}</p>
                </div>
              </div>
            ) : (
              <></>
            )}
            <div
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
                Наименование организации:{' '}
              </CFormLabel>
              {isView ? (
                <CFormLabel
                  style={{
                    width: '60%',
                  }}
                >
                  {data?.user?.company?.name || 'Не выбрано'}
                </CFormLabel>
              ) : (
                <CFormInput
                  type="text"
                  placeholder={'ООО "БТС-МОСТ' as any}
                  style={{
                    width: '60%',
                  }}
                  value={data?.user?.company?.name}
                  disabled={true}
                  /* onChange={(e: any) => {
                  handleChangeActDetail('nameOfCompany', e)
                }} */
                />
              )}
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
                Наименование объекта:
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
                <CFormInput
                  type="text"
                  placeholder={'Автоматически' as any}
                  style={{
                    width: '60%',
                  }} //setDataAct
                  value={
                    data?.researchObjects
                      ? data?.researchObjects?.name
                      : 'Не выбрано'
                  }
                  disabled={true}
                  /* onChange={(e: any) => {
                  handleChangeActDetail('objectName', e)
                }} */
                />
              )}
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
                  placeholder={'Автоматически' as any}
                  style={{
                    width: '60%',
                  }}
                  value={data?.samplingLocation}
                  disabled={true}
                  /* onChange={(e: any) => {
                  handleChangeActDetail('samplingLocation', e)
                }} */
                />
              )}
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
                  placeholder={'Автоматически' as any}
                  style={{
                    width: '60%',
                  }}
                  value={data?.objectControl}
                  disabled={true}
                  /* onChange={(e: any) => {
                  handleChangeActDetail('objectOfControl', e)
                }} */
                />
              )}
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
                Дата отбора проб:
              </CFormLabel>
              {isView ? (
                <CFormLabel
                  style={{
                    width: '60%',
                  }}
                >
                  {getDateV1(actDetail?.samplingDate) || 'Не выбрано'}
                </CFormLabel>
              ) : (
                <CDatePicker
                  required
                  placeholder={'Выберите дату'}
                  style={{
                    width: '60%',
                  }}
                  locale="ru-RU"
                  date={actDetail?.samplingDate}
                  onDateChange={(e: any) => {
                    if (!e) {
                      handleChangeActDetail('samplingDate', '')
                      return
                    }
                    const date = new Date(e)
                    date.setMinutes(date.getMinutes() - e.getTimezoneOffset())
                    handleChangeActDetail('samplingDate', date?.toISOString())
                  }}
                  weekdayFormat={1}
                />
              )}
            </div>
            {/* START */}
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
                Время отбора проб:
              </CFormLabel>
              {isView ? (
                <CFormLabel
                  style={{
                    width: '60%',
                  }}
                >
                  {actDetail?.samplingTime || 'Не выбрано'}
                </CFormLabel>
              ) : (
                <CTimePicker
                  seconds={false}
                  placeholder="Выберите время"
                  style={{
                    width: '60%',
                  }}
                  time={actDetail?.samplingTime ?? ''}
                  locale="ru-RU"
                  onTimeChange={(e: any) => {
                    const getTime = e.split(/[ ,:]/g)
                    handleChangeActDetail(
                      'samplingTime',
                      `${getTime[0]}:${getTime[1]}:${getTime[2]}`,
                    )
                  }}
                />
              )}
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
                Наименование материала:
              </CFormLabel>
              {isView ? (
                <CFormLabel
                  style={{
                    width: '60%',
                  }}
                >
                  {actDetail?.materialName || 'Не выбрано'}
                </CFormLabel>
              ) : (
                <CFormInput
                  required
                  type="text"
                  placeholder={'введите наименование материала' as any}
                  style={{
                    width: '60%',
                  }}
                  value={actDetail?.materialName}
                  onChange={(e: any) => {
                    handleChangeActDetail('materialName', e)
                  }}
                />
              )}
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
                Количество образцов:
              </CFormLabel>
              {isView ? (
                <CFormLabel
                  style={{
                    width: '40%',
                  }}
                >
                  {actDetail?.samplingQuantity || 'Не выбрано'}
                </CFormLabel>
              ) : (
                <CFormInput
                  type="string"
                  placeholder={'введите количество образцов' as any}
                  style={{
                    width: '60%',
                  }}
                  value={actDetail?.samplingQuantity}
                  onChange={(e: any) => {
                    handleChangeActDetail('samplingQuantity', e)
                  }}
                />
              )}
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
                Документ о качестве:
              </CFormLabel>
              {isView ? (
                <CFormLabel
                  style={{
                    width: '60%',
                  }}
                >
                  {actDetail?.qualityDocument || 'Не выбрано'}
                </CFormLabel>
              ) : (
                <CFormInput
                  type="text"
                  placeholder={'введите № документа о качестве' as any}
                  style={{
                    width: '60%',
                  }}
                  value={actDetail?.qualityDocument}
                  onChange={(e: any) => {
                    handleChangeActDetail('qualityDocument', e)
                  }}
                />
              )}
            </div>
            <div
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
                Ответственное лицо:
              </CFormLabel>
              {isView ? (
                <CFormLabel
                  style={{
                    width: '60%',
                  }}
                >
                  {actDetail?.respUser ?? 'Не выбрано'}
                </CFormLabel>
              ) : (
                <>
                  <CFormInput
                    ref={employeesInput}
                    type="text"
                    placeholder={'выберите ответственного сотрудника' as any}
                    style={{
                      width: '60%',
                    }}
                    value={actDetail?.respUser}
                    onChange={(e: any) => {
                      handleChangeActDetail('respUser', e.target.value)
                    }}
                    /* onChange={(e: any) => {
                    setEmployeeName(e.target.value)
                    setFilteredEmployeesList(() =>
                      employeesList.filter((i: any) => {
                        const employeeName = `${i.surname} ${i.name} ${i.lastName}`
                        return (
                          employeeName
                            .toLowerCase()
                            .indexOf(e.target.value.toLowerCase()) >
                          -1
                        )
                      }),
                    )

                    employees.current.style.display = 'block'
                  }} */
                    /* onFocus={() => {
                    employees.current.style.display = 'block'
                  }} */
                  />
                  {/* <div
                  ref={employees}
                  style={{
                    position: 'absolute',
                    right: 0,
                    width: '60%',
                    top: '100%',
                    display: 'none',
                  }}
                >
                  <CListGroup className="input-list">
                    {filteredEmployeesList.length
                      ? filteredEmployeesList.map(
                          (i: any, index: number) => (
                            <CListGroupItem
                              onClick={(e: any) => {
                                console.log(i)
                                setActDetail({
                                  ...actDetail,
                                  respCompUserId: i.id,
                                })
                                setEmployeeName(
                                  `${i.name} ${i.surname} ${i.lastName}`,
                                )
                                employees.current.style.display =
                                  'none'
                              }}
                              style={{
                                listStyleType: 'none',
                                cursor: 'pointer',
                              }}
                              key={index}
                              tabIndex={0}
                              onKeyDown={(e: any) => {
                                if (e.keyCode == 13) {
                                  handleChangeActDetail(
                                    'respCompUserId',
                                    i.id,
                                  )
                                  setEmployeeName(
                                    `${i.name} ${i.surname} ${i.lastName}`,
                                  )
                                  employees.current.style.display =
                                    'none'
                                }
                              }}
                            >
                              {`${i.name} ${i.surname} ${i.lastName}`}
                            </CListGroupItem>
                          ),
                        )
                      : null}
                  </CListGroup>
                </div> */}
                </>
              )}
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
                Примечание:
              </CFormLabel>
              {isView ? (
                <CFormLabel
                  style={{
                    width: '40%',
                  }}
                >
                  {actDetail?.note || 'Не выбрано'}
                </CFormLabel>
              ) : (
                <CFormInput
                  type="text"
                  placeholder={'введите примечания' as any}
                  style={{
                    width: '60%',
                  }}
                  value={actDetail?.note}
                  onChange={(e: any) => {
                    handleChangeActDetail('note', e)
                  }}
                />
              )}
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
                Условия окружающей среды:
              </CFormLabel>
              {isView ? (
                <CFormLabel
                  style={{
                    width: '40%',
                    whiteSpace: 'normal',
                  }}
                >
                  {actDetail?.environmental || 'Не выбрано'}
                </CFormLabel>
              ) : (
                <CFormInput
                  type="text"
                  placeholder={'введите условия окружающей среды' as any}
                  style={{
                    width: '60%',
                  }}
                  value={actDetail?.environmental}
                  onChange={(e: any) => {
                    handleChangeActDetail('environmental', e)
                  }}
                />
              )}
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
export default ThirdCard

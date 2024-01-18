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
  CForm,
  CFormTextarea,
} from '@coreui/react-pro'
import { downloadPDF } from '../shared/functions/globalFunc'

const SecondCard = (Props: any) => {
  const {
    data,
    commentRef,
    isView,
    emptyCommentator,
    setTimeV2,
    setDataComment,
    sendButtonStyle,
    params,
    dataUser,
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
        <div>Комментарии к заявке</div>
      </CCardHeader>
      <CCardBody
        style={{
          padding: '4rem 4rem',
        }}
        ref={componentRef}
        id="capture"
      >
        <CCol
          ref={commentRef}
          style={{
            wordBreak: 'break-word',
          }}
        >
          <CForm>
            {/* UPPER INFO BORDER */}
            {isView ? (
              <div>
                <div
                  className="avoid-break-inside"
                  style={{
                    margin: '0 auto',
                    width: '250px',
                    fontSize: '16px',
                    color: 'black',
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }}
                >
                  <p style={{}}>Комментарии к заявке № {data?.id}</p>
                </div>
              </div>
            ) : (
              <></>
            )}
            <div>
              {data?.comments?.length ? (
                <div>
                  {data?.comments?.map((e: any, i: number) => {
                    const { user, createdAt } = e
                    const { surname, name, lastName } = user ?? emptyCommentator

                    return (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          marginBottom: '0.7rem',
                        }}
                        className="auto-page-break-stop-recursive avoid-break-inside"
                      >
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '25%',
                          }}
                        >
                          {/* <CFormLabel> */}
                          <div
                            style={{
                              marginBottom: '0.5rem',
                              width: '590px',
                            }}
                          >
                            {surname} {name[0]}. {lastName[0]}. :
                          </div>
                          {/* </CFormLabel> */}
                          <div
                            style={{
                              width: '300px',
                              color: 'GrayText',
                              fontSize: '12px',
                              marginBottom: '0.5rem',
                            }}
                          >
                            {setTimeV2(e.createdAt)}
                          </div>
                        </div>
                        <div
                          style={{
                            wordWrap: 'break-word',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                            width: '75%',
                          }}
                        >
                          {e?.text}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <></>
              )}
            </div>

            <div data-html2canvas-ignore>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'end',
                  marginTop: '2rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '590px',
                  }}
                ></div>
                {/* //FIELD BAR */}
                <div style={{ width: '100%', padding: '0 1rem' }}>
                  <CFormTextarea
                    id="info"
                    className={s.textArea}
                    rows={data?.comment?.split('\n').length}
                    placeholder={
                      'Введите: Класс прочности бетона; Материал; Тип грунта; и т.д.' as any
                    }
                    style={{
                      width: '100%',
                    }}
                    value={data?.comment}
                    onChange={(e: any) => {
                      setDataComment({
                        text: e?.target?.value,
                        orderId: params.id,
                        userId: dataUser.id,
                      })
                      sendButtonStyle(e?.target?.value)
                    }}
                  />
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'right',
                    }}
                  ></div>
                </div>
              </div>

              {/* BUTTOM BORDER */}
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
            downloadPDF(commentRef)
          }}
          disabled={loader}
        >
          {loader ? <span>Процесс загрузки...</span> : <span>Cкачать</span>}
        </CButton>
      </div>
    </CCard>
  )
}
export default SecondCard

import React, {Fragment, useContext, useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import Trash from '../../../../../../../../img/icons/Trash'
import {MachineTranslationTabContext} from '../MachineTranslationTab'
import {deleteDeepLGlossary} from '../../../../../api/deleteDeepLGlossary'

export const DeepLGlossaryRow = ({engineId, row, setRows, isReadOnly}) => {
  const {setNotification} = useContext(MachineTranslationTabContext)

  const [isActive, setIsActive] = useState(false)
  const [isWaitingResult, setIsWaitingResult] = useState(false)

  useEffect(() => {
    setIsActive(row.isActive)
  }, [row.isActive])

  const onChangeIsActive = (e) => {
    setNotification()
    const isActive = e.currentTarget.checked
    setRows((prevState) =>
      prevState.map((glossary) => ({
        ...glossary,
        isActive: isActive && glossary.id === row.id,
      })),
    )
  }

  const deleteGlossary = () => {
    setNotification()

    setIsWaitingResult(true)
    deleteDeepLGlossary({engineId, id: row.id})
      .then((data) => {
        if (data.id === row.id)
          setRows((prevState) => prevState.filter(({id}) => id !== row.id))
      })
      .catch(() => {
        setNotification({
          type: 'error',
          message: 'Glossary delete error',
        })
      })
      .finally(() => setIsWaitingResult(false))
  }

  return (
    <Fragment>
      <div className="align-center">
        <input
          name="active"
          checked={isActive}
          onChange={onChangeIsActive}
          type="checkbox"
          disabled={isWaitingResult || isReadOnly}
        />
      </div>
      <div className="glossary-row-name">
        <div className="tooltip-input-name">
          <div className="glossary-row-name-input glossary-deepl-row-name-input">
            {row.name}
          </div>
        </div>
      </div>
      {!isReadOnly && (
        <>
          <div className="glossary-row-import-button" />
          <div className="glossary-row-delete">
            <button
              className="grey-button"
              disabled={isWaitingResult}
              onClick={deleteGlossary}
            >
              <Trash size={12} />
            </button>
          </div>
          {isWaitingResult && <div className="spinner"></div>}
        </>
      )}
    </Fragment>
  )
}

DeepLGlossaryRow.propTypes = {
  engineId: PropTypes.number,
  row: PropTypes.object,
  setRows: PropTypes.func,
  isReadOnly: PropTypes.bool,
}

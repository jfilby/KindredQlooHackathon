import { useState } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CancelIcon from '@mui/icons-material/Cancel'
import SaveIcon from '@mui/icons-material/Save'
import { Alert, FormControl, InputLabel, Select, TextField, Typography } from '@mui/material'
import CopyTextIcon from '@/serene-core-client/components/basics/copy-text-icon'
import TextAreaField from '@/serene-core-client/components/basics/text-area-field'
import LoadTechByFilter from '@/serene-core-client/components/tech/load-techs'
import LabeledIconButton from '@/serene-core-client/components/buttons/labeled-icon-button'
import { BaseDataTypes } from '@/shared/types/base-data-types'
import TechAutocomplete from '@/serene-core-client/components/tech/tech-autocomplete'

interface Props {
  userProfileId: string
  agentRoles: any[]
  dcThreads: any[]
  domains: any[]
  alertSeverity: any
  setAlertSeverity: any
  message: string | undefined
  setMessage: any
  aiPersona: any
  setAiPersona: any
  setEditMode: any
  setLoadAction: any
  setSaveAction: any
}

export default function EditAiPersona({
                          userProfileId,
                          agentRoles,
                          dcThreads,
                          domains,
                          alertSeverity,
                          setAlertSeverity,
                          message,
                          setMessage,
                          aiPersona,
                          setAiPersona,
                          setEditMode,
                          setLoadAction,
                          setSaveAction
                        }: Props) {

  // Consts
  const indexPage = `/ai-personas/${aiPersona.id}`

  // State
  const [techs, setTechs] = useState<any[] | undefined>(undefined)

  const [name, setName] = useState<string>(aiPersona.name ? aiPersona.name : '')
  const [status, setStatus] = useState<string>(aiPersona.i__status ? aiPersona.i__status : BaseDataTypes.activeStatus)
  const [domainId, setDomainId] = useState<string>(aiPersona.domainId ? aiPersona.domainId : '')
  const [startingModeId, setStartingModeId] = useState<string>(aiPersona.startingModeId ? aiPersona.startingModeId : '')
  const [startingDcThreadId, setStartingDcThreadId] = useState<string>(aiPersona.startingDcThreadId ? aiPersona.startingDcThreadId : '')
  const [role, setRole] = useState<string>(aiPersona.role ? aiPersona.role : '')
  const [maxPrevMessages, setMaxPrevMessages] = useState<string>(aiPersona.maxPrevMessages ? aiPersona.maxPrevMessages : '0')
  const [techId, setTechId] = useState<string>(aiPersona.techId ? aiPersona.techId : '')
  const [prompt, setPrompt] = useState<string>(aiPersona.prompt ? aiPersona.prompt : '')

  // Functions
  function verifyFields() {

    if (name == null ||
        name.trim() === '') {

      setAlertSeverity('error')
      setMessage('The name must be specified')
      return false
    }

    if (status == null ||
        status.trim() === '') {

      setAlertSeverity('error')
      setMessage('The status must be specified')
      return false
    }

    // Verified OK
    return true
  }

  // Render
  return (
    <div style={{ paddingTop: '2em', minWidth: 275 }}>

      {/* <p>alertSeverity: {alertSeverity}</p>
      <p>message: {message}</p> */}

      {message != null ?
        <Alert
          severity={alertSeverity}
          style={{ marginBottom: '2em' }}>
          {message}
        </Alert>
      :
        <></>
      }

      <div style={{ marginBottom: '2em' }}>

        <Typography
          style={{ marginBottom: '1em' }}
          variant='h5'>
          Details
        </Typography>

        {aiPersona != null ?
          <div style={{ marginBottom: '2em' }}>
            <Typography style={{ display: 'inline' }} variant='body1'>
              Agent id:&nbsp;
            </Typography>
            <Typography style={{ display: 'inline', fontFamily: 'monospace' }}>
              {aiPersona.id}
            </Typography>
            <CopyTextIcon text={aiPersona.id} />
          </div>
        :
          <></>
        }

        <div style={{ marginBottom: '1em' }}>
          <TextField
            autoComplete='off'
            label='Name'
            onChange={(e) => {
              setName(e.target.value)

              aiPersona.name = e.target.value
              setAiPersona(aiPersona)
            }}
            required
            style={{ marginBottom: '1em' }}
            value={name} />
        </div>

        <div style={{ marginBottom: '2em', width: '15em' }}>
          <FormControl fullWidth>
            <InputLabel
              htmlFor='select-status'
              required
              shrink>
              Status
            </InputLabel>
            <Select
              inputProps={{
                id: 'select-status',
              }}
              label='Status'
              native
              onChange={(e) => {
                setStatus(e.target.value)

                aiPersona.i__status = e.target.value
                setAiPersona(aiPersona)
              }}
              variant='outlined'
              value={status}>
              {BaseDataTypes.statusArray.map((status) => (
                <option key={status.name} value={status.value}>
                  {status.name}
                </option>
              ))}
            </Select>
          </FormControl>
        </div>

        <div style={{ marginBottom: '2em', width: '15em' }}>
          <FormControl fullWidth>
            <InputLabel
              htmlFor='select-domain'
              required>
              Domain
            </InputLabel>
            <Select
              inputProps={{
                id: 'select-domain',
              }}
              label='Domain'
              native
              onChange={(e) => {
                setDomainId(e.target.value)

                aiPersona.domainId = e.target.value
                setAiPersona(aiPersona)
              }}
              variant='outlined'
              value={domainId}>
              <option value=''>
              </option>
              {domains.map((domain) => (
                <option key={domain.name} value={domain.id}>
                  {domain.name}
                </option>
              ))}
            </Select>
          </FormControl>
        </div>

        <div style={{ marginBottom: '2em', width: '15em' }}>
          <FormControl fullWidth>
            <InputLabel
              htmlFor='select-starting-mode-id'>
              Starting mode
            </InputLabel>
            <Select
              inputProps={{
                id: 'select-starting-mode-id',
              }}
              label='Starting mode'
              native
              onChange={(e) => {
                setStartingModeId(e.target.value)

                aiPersona.startingModeId = e.target.value
                setAiPersona(aiPersona)
              }}
              variant='outlined'
              value={startingModeId}>
              <option value=''>
              </option>
              {agentRoles.map((agentRole) => (
                <option key={agentRole.name} value={agentRole.id}>
                  {agentRole.name}
                </option>
              ))}
            </Select>
          </FormControl>
        </div>

        <div style={{ marginBottom: '2em', width: '15em' }}>
          <FormControl fullWidth>
            <InputLabel
              htmlFor='select-starting-dc-thread-id'>
              Starting DC thread
            </InputLabel>
            <Select
              inputProps={{
                id: 'select-starting-dc-thread-id',
              }}
              label='Starting DC thread'
              native
              onChange={(e) => {
                setStartingDcThreadId(e.target.value)

                aiPersona.startingDcThreadId = e.target.value
                setAiPersona(aiPersona)
              }}
              variant='outlined'
              value={startingDcThreadId}>
              <option value=''>
              </option>
              {dcThreads.map((dcThread) => (
                <option key={dcThread.name} value={dcThread.id}>
                  {dcThread.name}
                </option>
              ))}
            </Select>
          </FormControl>
        </div>

        <TextField
          id='role'
          label='Role'
          onChange={(e: any) => {
            setRole(e.target.value)

            aiPersona.role = e.target.value
            setAiPersona(aiPersona)
          }}
          required
          style={{ marginBottom: '2em' }}
          value={role} />
        <br/>

        <TextField
          id='max-prev-messages'
          label='Max previous messages (context)'
          onChange={(e: any) => {
            setMaxPrevMessages(e.target.value)

            aiPersona.maxPrevMessages = e.target.value
            setAiPersona(aiPersona)
          }}
          required
          style={{ marginBottom: '2em' }}
          value={maxPrevMessages} />
        <br/>

        {techs != null ?
          <TechAutocomplete
            label='Model'
            onChange={(newId: string) => {

              aiPersona.techId = newId
              setAiPersona(aiPersona)
            }}
            setValue={setTechId}
            style={{ marginBottom: '2em' }}
            value={techId}
            values={techs}
            variant='outlined' />
        :
          <Typography
            style={{ marginBottom: '2em' }}
            variant='body1'>
            Loading models..
          </Typography>
        }

        <TextAreaField
          id='prompt'
          label='Prompt'
          minRows={5}
          onChange={(e: any) => {
            setPrompt(e.target.value)

            aiPersona.prompt = e.target.value
            setAiPersona(aiPersona)
          }}
          style={{ marginBottom: '2em' }}
          value={prompt} />

        <div style={{ textAlign: 'right' }}>
          <LabeledIconButton
            icon={SaveIcon}
            label='Save'
            onClick={(e: any) => {
              aiPersona.i__status = status

              if (verifyFields() === true) {

                setAiPersona(aiPersona)
                setSaveAction(true)
              }
            }}
            style={{ marginRight: '1em' }} />

          <LabeledIconButton
            icon={CancelIcon}
            label='Reset'
            onClick={(e: any) => {
              setLoadAction(true)
            }}
            style={{ marginRight: '1em' }} />

          <LabeledIconButton
            icon={ArrowBackIcon}
            label='Back'
            onClick={(e: any) => {
              window.location.href = indexPage
            }}
            style={{ marginRight: '1em' }} />
        </div>

      </div>

      <LoadTechByFilter
        userProfileId={userProfileId}
        resource='LLMs'
        setTechs={setTechs} />
    </div>
  )
}

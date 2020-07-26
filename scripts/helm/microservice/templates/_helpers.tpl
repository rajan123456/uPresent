{{/* vim: set filetype=mustache: */}}
{{/*
Allow the service name to be overridden.
*/}}
{{- define "microservice.serviceName" -}}
    {{- if .Values.service.nameOverride -}}
        {{- .Values.service.nameOverride -}}
    {{- else -}}
        {{- .Chart.Name -}}
  {{- end }}
{{- end -}}
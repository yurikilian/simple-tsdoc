# Lambda: {{name}}
## {{summary}}
{{remarks}}

---
## Input Parameters

{{#parameters}}
| Name | Type | Description |
| ---- | ---- | ----------- |
|{{name}}|{{type.type}}|{{description}} |

#### {{name}} sample:
```json
{{{sample}}}
```
{{/parameters}}
### Sample

---
## Output
*{{output.name}}* - {{output.description}}
#### Output sample:
```json
{{{output.sample}}}
```

## Interfaces
{{#interfaces}}
### *{{name}}*
| Name | Type |
| ---- | ---- |
{{#members}}
|{{name}}|{{type}}||
{{/members}}

{{/interfaces}}

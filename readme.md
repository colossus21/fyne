## Renamed to : Fyne

Fyne lets you generate a sample Golang application from a given JSON schema

### Installation:

```
npm install -g fyne
```
Test your installation
```
fyne --version
```

### Generate an application

1) Create a schema file ie. schema.json for model Payment
```json
{
  "name": "string",
  "amount": "int64",
  "paidAt": "time.Time"
}
```
2) Run
```
fyne template Payment schema.json
```

3) Voila!
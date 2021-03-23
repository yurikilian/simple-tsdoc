import { promises as fs } from 'fs';
import { GlobalDocumentation, Renderer } from './Renderer';
import mustache from 'mustache';
import { FunctionSkeleton } from '../parser/FunctionParser';
import { InterfaceSkeleton } from '../parser/InterfaceParser';

export default class AwsLambdaRenderer extends Renderer {
  async render(documentation: GlobalDocumentation): Promise<void> {
    const templateFile = await fs.readFile(this.options.templatePath);

    const awsFunction = documentation.functions[0] as FunctionSkeleton;
    const interfacesMap = new Map(
      documentation.interfaces.map((itf) => [itf.name, itf])
    );

    const outputType = Array.from(awsFunction.output.typeArgs.values())[0];
    const outputSample = this.generateTypeSample(
      { type: outputType },
      interfacesMap
    );

    const templateDescription = {
      name: awsFunction.name,
      summary: awsFunction.documentation.summary,
      remarks: awsFunction.documentation.remarks,
      parameters: awsFunction.documentation.parameters.map((parameter) => {
        const tsParameter = awsFunction.parameters.get(parameter.name);
        if (!tsParameter) {
          throw new Error(
            `Parameter ${parameter.name} does not have an interface or type associate with`
          );
        }

        const itfSample = this.generateTypeSample(tsParameter, interfacesMap);
        return {
          name: this.removeLineBreaks(parameter.name),
          description: this.removeLineBreaks(parameter.description),
          type: tsParameter,
          sample: JSON.stringify(itfSample, null, 2)
        };
      }),
      output: {
        name: `${this.removeLineBreaks(awsFunction.output.name)} <${Array.from(
          awsFunction.output.typeArgs.values()
        ).join(',')}>`,
        description: this.removeLineBreaks(awsFunction.documentation.returns),
        sample: JSON.stringify(outputSample, null, 2)
      },
      interfaces: documentation.interfaces
    };

    const mustacheView = mustache.render(
      templateFile.toString(),
      templateDescription
    );

    await fs.writeFile(this.options.outputPath, mustacheView);
  }

  private removeLineBreaks(message: string) {
    return message.replace(/[\r\n]+/gm, '');
  }

  private generateTypeSample(
    parameter: { type: string; typeArgs?: string },
    interfacesMap: Map<any, any>
  ): any {
    switch (parameter.type) {
      case 'boolean':
        return Math.random() < 0.5;
      case 'number':
        return Math.floor(Math.random() * Math.floor(10));
      case 'string':
        return Math.random().toString(36).substring(7);
      default: {
        const compoundType = interfacesMap.get(
          parameter.type
        ) as InterfaceSkeleton;

        if (compoundType) {
          const members: { [key: string]: string | null } = {};

          for (const member of compoundType.members) {
            members[member.name] = this.generateTypeSample(
              { type: member.type, typeArgs: member.typeArguments },
              interfacesMap
            );
          }
          return members;
        } else {
          const isCollection = ['Array', 'Map', 'Set'].includes(parameter.type);
          if (isCollection && parameter.typeArgs) {
            return [
              this.generateTypeSample(
                { type: parameter.typeArgs },
                interfacesMap
              )
            ];
          }
        }

        return null;
      }
    }
  }
}

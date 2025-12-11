import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

export class CustomerAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1. The Lambda Function
    const customerLambda = new nodejs.NodejsFunction(this, 'CustomerHandler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: 'lambda/handler.ts', // Points to backend code
      handler: 'handler',
      bundling: {
        minify: true,
        sourceMap: true,
      },
      environment: {
        // In a real scenario, you'd put Table Name here
        DATA_SOURCE: 'MOCK' 
      }
    });

    // 2. API Gateway (Rest API)
    const api = new apigateway.RestApi(this, 'CustomerApi', {
      restApiName: 'Customer Service',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    // Integrate Lambda with API
    const customers = api.root.addResource('customers');
    customers.addMethod('GET', new apigateway.LambdaIntegration(customerLambda));
    
    // Output the URL for the Frontend
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
    });
  }
}